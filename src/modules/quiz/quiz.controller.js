import e from 'connect-timeout'
import AppError from '../../common/utils/appError.js'
import { AppResponse } from '../../common/utils/appResponse.js'
import { catchAsync } from '../../common/utils/errorHandler.js'
import QuizGenerator from '../../common/utils/gemini.js'
import { createQuestion } from '../question/question.service.js'
import { updateUser } from '../user/user.service.js'
import Quiz from './quiz.schema.js'
import { createQuiz, getQuizById } from './quiz.service.js'

export const httpCreateQuiz = catchAsync(async (req, res) => {
    const { count } = req.query
    const { file, user } = req
    console.log(file, user)
    if (!count || !file) {
        throw new AppError('A File or count required')
    }
    const quizClass = new QuizGenerator()
    const quiz = await quizClass.generateQuiz(
        count,
        file?.originalname ?? file.name,
        file?.buffer
    )
    const newQuiz = await createQuiz({
        name: quiz.title,
        count: quiz.questions.length,
    })
    const questionIds = await Promise.all(
        quiz.questions.map(async (question) => {
            const newQuestion = await createQuestion({
                quizId: newQuiz.id,
                question: question.question,
                answers: question.answers,
                correctAnswer: question.correctAnswer,
            })
            return newQuestion.id
        })
    )
    newQuiz.questions = questionIds
    await newQuiz.save()
    console.log(user)
    await updateUser(user.id, { $push: { quizzes: [newQuiz] } })
    const response = await Quiz.findById(newQuiz.id).populate('questions').exec()

    return AppResponse(res, 200, response, 'Quiz gotten successfully')
})

export const httpGetQuiz = catchAsync(async (req, res) => {
    const { quizId } = req.params
    const quiz = await getQuizById(quizId)
    return AppResponse(res, 200, quiz, 'Quiz gotten successfully')
})

export const httpMarkQuiz = catchAsync(async (req, res) => {
    const { quizId, answers } = req.body
    // {
    // questionId: "id of questions",
    // answer: 0
    // }
    if (!answers || !quizId) {
        throw new AppError('Answers and quizId required')
    }
    const quiz = await getQuizById(quizId)
    const questions = quiz.questions
    let score = 0
    for (let question of questions) {
        for (let answers of answers) {
            if (answers.questionId === question.id) {
                if (answers.answer === question.correctAnswer) {
                    score++
                }
            }
        }
    }
    quiz.score = score
    await quiz.save()
    return AppResponse(res, 200, quiz.score, 'Answer calculated successfully')
})

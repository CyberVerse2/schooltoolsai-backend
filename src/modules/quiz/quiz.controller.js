import AppError from '../../common/utils/appError.js'
import { AppResponse } from '../../common/utils/appResponse.js'
import { catchAsync } from '../../common/utils/errorHandler.js'
import QuizGenerator from '../../common/utils/gemini.js'
import { createQuestion } from '../question/question.service.js'
import { updateUser } from '../user/user.service.js'
import Quiz from './quiz.schema.js'
import { createQuiz } from './quiz.service.js'

export const httpCreateQuiz = catchAsync(async (req, res) => {
    const { count } = req.query
    const { file, user } = req
    console.log(file)
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
    const response = await Quiz.findById(newQuiz.id).populate('questions')

    return AppResponse(res, 200, response, 'Quiz gotten successfully')
})

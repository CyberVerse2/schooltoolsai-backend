import Quiz from './quiz.schema.js'

export async function createQuiz(body) {
    return await Quiz.create(body)
}

export async function getQuestions(quizId) {
  const quiz = await Quiz.findById(quizId).populate('questions').exec()
  return quiz.questions
}

export async function getQuizById(id) {
  return await Quiz.findById(id).populate('questions').exec()
}

export async function deleteQuiz(id) {
  return await Quiz.findByIdAndDelete(id)
}


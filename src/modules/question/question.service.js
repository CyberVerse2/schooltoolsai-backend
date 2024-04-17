import Question from './question.schema'

export async function createQuestion(body) {
    return await Question.create(body)
}

export async function getAnswers(QuestionId) {
    const question = await Question.findById(QuestionId).populate('questions')
    return question.answers
}

export async function getQuestionById(id) {
    return await Question.findById(id)
}

export async function deleteQuestion(id) {
    return await Question.findByIdAndDelete(id)
}
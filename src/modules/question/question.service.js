import Question from './question.schema.js'

export async function createQuestion(body) {
    return await Question.create(body)
}

export async function getAnswers(questionId) {
    const question = await getQuestionById(questionId)
    return question.answers
}

export async function getQuestionById(id) {
    return await Question.findById(id)
}

export async function deleteQuestion(id) {
    return await Question.findByIdAndDelete(id)
}

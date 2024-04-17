import AppError from '../../common/utils/appError.js'
import { AppResponse } from '../../common/utils/appResponse.js'
import { catchAsync } from '../../common/utils/errorHandler.js'
import QuizGenerator from '../../common/utils/gemini.js'

export const httpCreateQuiz = catchAsync(async (req, res) => {
    const { count } = req.query
    const { file } = req
    if (!count || !file) {
        throw new AppError('A File or count required')
    }
    const quiz = new QuizGenerator()
    const rawQuiz = await quiz.generateQuiz(count, file?.filename, file?.buffer)

    return AppResponse(res, 200, rawQuiz, 'Quiz gotten successfully')
})

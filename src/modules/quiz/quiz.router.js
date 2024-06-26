import { Router } from 'express'
import { httpCreateQuiz, httpGetQuiz, httpMarkQuiz } from './quiz.controller.js'
import upload from '../../common/utils/multer.js'
import { protect } from '../../common/middlewares/protect.js'

const quizRouter = Router()

quizRouter.use(protect)

quizRouter.post('/', upload.single('file'), httpCreateQuiz)
quizRouter.get('/:quizId', httpGetQuiz)
quizRouter.post('/mark', httpMarkQuiz)
export default quizRouter

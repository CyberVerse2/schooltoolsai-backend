import { Router } from "express";
import { httpCreateQuiz } from "./quiz.controller.js";
import upload from "../../common/utils/multer.js";

const quizRouter = Router()

quizRouter.post('/', upload.single('file'), httpCreateQuiz)

export default quizRouter

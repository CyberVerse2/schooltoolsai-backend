import { Router } from "express";
import {
  httpDeleteUser,
  httpGetCurrentUser,
  httpGetUserQuizzes,
  httpUpdateUser,
} from "./user.controller.js";
import { protect } from "../../common/middlewares/protect.js";

const userRouter = Router();

userRouter.use(protect);

userRouter.get("/", httpGetCurrentUser);
userRouter.get('/quizzes', httpGetUserQuizzes)
userRouter.patch("/", httpUpdateUser);
userRouter.delete("/", httpDeleteUser);

export default userRouter
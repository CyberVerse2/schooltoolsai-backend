import { Router } from "express";
import {
  httpDeleteUser,
  httpGetCurrentUser,
  httpUpdateUser,
} from "./user.controller.js";
import { protect } from "../../common/middlewares/protect.js";

export const userRouter = Router();

userRouter.use(protect);

userRouter.get("/", httpGetCurrentUser);
userRouter.patch("/", httpUpdateUser);
userRouter.delete("/", httpDeleteUser);

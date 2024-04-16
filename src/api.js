import { Router } from "express";
// import { userRouter } from "./modules/user/user.router.js";
import authRouter from "./modules/auth/auth.router.js";

export const api = Router();

api.use("/auth", authRouter);
// api.use("/users", userRouter);

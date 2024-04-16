import { Router } from "express";
import { httpSignUp, httpLogin } from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", httpSignUp);
authRouter.post("/login", httpLogin);

export default authRouter

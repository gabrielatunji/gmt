import { Router } from "express";
import { userLogin, userSignup } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post('/signup', userSignup);
userRouter.post('/login', userLogin);

export default userRouter;

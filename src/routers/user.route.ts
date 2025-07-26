import { Router } from "express";
import { userLogin, userSignup, userSubscriptions } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post('/signup', userSignup);
userRouter.post('/login', userLogin);
userRouter.post('/subscribe', userSubscriptions); 

export default userRouter;

import { Router, RequestHandler } from "express";
import { userLogin, userSignup, userSubscriptions } from "../controllers/user.controller";
import isAuthenticated  from '../middlewares/isAuthenticated'; 

const userRouter = Router();

userRouter.post('/signup', userSignup);
userRouter.post('/login', userLogin);
userRouter.post('/subscribe', isAuthenticated as RequestHandler, userSubscriptions);


export default userRouter;


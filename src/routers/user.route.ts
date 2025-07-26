import { Router, Request, Response, NextFunction } from "express";
import { userLogin, userSignup, userSubscriptions } from "../controllers/user.controller";
import  isAuthenticated, { AuthenticatedRequest} from '../middlewares/isAuthenticated'

const userRouter = Router();

userRouter.post('/signup', userSignup);
userRouter.post('/login', userLogin);
userRouter.post('/subscribe', isAuthenticated as AuthenticatedRequest, userSubscriptions);


export default userRouter;


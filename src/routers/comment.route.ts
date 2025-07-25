import { Router } from "express";
import { makeComment, deleteComment } from "../controllers/comment.controller";

const commentRouter = Router();

commentRouter.post('/signup', makeComment);
commentRouter.post('/login', deleteComment);

export default commentRouter;

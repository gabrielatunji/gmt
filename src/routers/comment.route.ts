import { Router, RequestHandler } from "express";
import { makeComment, deleteComment } from "../controllers/comment.controller";
import isAuthenticated from "../middlewares/isAuthenticated";

const commentRouter = Router();

commentRouter.post('/comment', isAuthenticated as RequestHandler, makeComment);
commentRouter.post('/removecomment', isAuthenticated as RequestHandler, deleteComment);

export default commentRouter;

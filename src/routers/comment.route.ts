import { Router, RequestHandler } from "express";
import { deleteComment } from "../controllers/comment.controller";
import isAuthenticated from "../middlewares/isAuthenticated";

const commentRouter = Router();

commentRouter.delete('/:commentID', isAuthenticated as RequestHandler, deleteComment);

export default commentRouter;

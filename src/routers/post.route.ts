import { Router, RequestHandler } from "express";
import { createPost, getAllPosts, getSinglePostByID, deletePost } from "../controllers/posts.controller";
import isAuthenticated from "../middlewares/isAuthenticated";
import upload from "../middlewares/multer";
import { makeComment } from "../controllers/comment.controller";

const postRouter = Router();

postRouter.post('/create', isAuthenticated as RequestHandler, upload.single('attachment'), createPost);
postRouter.get('/allposts', getAllPosts);
postRouter.get('/:postID', getSinglePostByID); 
postRouter.delete('/:postID/delete', isAuthenticated as RequestHandler, deletePost);
postRouter.post('/:postID/comment', isAuthenticated as RequestHandler ,makeComment); 


export default postRouter;

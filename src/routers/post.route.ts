import { Router, RequestHandler } from "express";
import { createPost, deletePost, getAllPosts, getSinglePostByID } from "../controllers/posts.controller";
import isAuthenticated from "../middlewares/isAuthenticated";
import upload from "../middlewares/multer";

const postRouter = Router();

postRouter.post('/create', isAuthenticated as RequestHandler, upload.single('attachment'), createPost);
postRouter.post('/delete', isAuthenticated as RequestHandler, deletePost);
postRouter.get('/allposts', getAllPosts);
postRouter.get('/:postID', getSinglePostByID); 


export default postRouter;

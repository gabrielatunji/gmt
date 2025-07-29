import { Router, RequestHandler } from "express";
import { createPost, getAllPosts, getSinglePostByID, userDeletePost } from "../controllers/posts.controller";
import isAuthenticated from "../middlewares/isAuthenticated";
import upload from "../middlewares/multer";
import { adminDeleteComment, adminDeletePost } from "../controllers/admin.controller";

const postRouter = Router();

postRouter.post('/create', isAuthenticated as RequestHandler, upload.single('attachment'), createPost);
postRouter.delete('/:postID/delete', isAuthenticated as RequestHandler, adminDeletePost);
postRouter.delete('/:postID/delete', isAuthenticated as RequestHandler, userDeletePost); 
postRouter.get('/allposts', getAllPosts);
postRouter.get('/:postID', getSinglePostByID); 


export default postRouter;

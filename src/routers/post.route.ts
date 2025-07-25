import { Router } from "express";
import { createPost, deletePost, getAllPosts, getSinglePostByID } from "../controllers/posts.controller";

const postRouter = Router();

postRouter.post('/create', createPost);
postRouter.post('/delete', deletePost);
postRouter.get('/allposts', getAllPosts);
postRouter.get('/:postID', getSinglePostByID); 


export default postRouter;

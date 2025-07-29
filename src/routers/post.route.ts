import { Router, RequestHandler } from "express";
import { createPost, getAllPosts, getSinglePostByID, deletePost } from "../controllers/posts.controller";
import isAuthenticated from "../middlewares/isAuthenticated";
import upload from "../middlewares/multer";
import { makeComment } from "../controllers/comment.controller";

const postRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Operations related to blog posts
 */

/**
 * @swagger
 * /post/create:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post.
 *                 example: My Awesome Post
 *               body:
 *                 type: string
 *                 description: The content of the post.
 *                 example: This is the body of my awesome post.
 *               attachment:
 *                 type: string
 *                 format: binary
 *                 description: An optional attachment for the post.
 *     responses:
 *       201:
 *         description: Post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
postRouter.post('/create', isAuthenticated as RequestHandler, upload.single('attachment'), createPost);

/**
 * @swagger
 * /post/allposts:
 *   get:
 *     summary: Retrieve all blog posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: A list of blog posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
postRouter.get('/allposts', getAllPosts);

/**
 * @swagger
 * /post/{postID}:
 *   get:
 *     summary: Retrieve a single blog post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to retrieve
 *     responses:
 *       200:
 *         description: The requested blog post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
postRouter.get('/:postID', getSinglePostByID);

/**
 * @swagger
 * /post/{postID}/delete:
 *   delete:
 *     summary: Delete a blog post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete
 *     responses:
 *       204:
 *         description: Post deleted successfully.
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
postRouter.delete('/:postID/delete', isAuthenticated as RequestHandler, deletePost);

/**
 * @swagger
 * /post/{postID}/comment:
 *   post:
 *     summary: Add a comment to a blog post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postID
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 description: The comment content.
 *                 example: This is a great comment!
 *     responses:
 *       201:
 *         description: Comment created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Post not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
postRouter.post('/:postID/comment', isAuthenticated as RequestHandler ,makeComment);

export default postRouter;
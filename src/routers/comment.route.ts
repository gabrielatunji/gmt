import { Router, RequestHandler } from "express";
import { deleteComment } from "../controllers/comment.controller";
import isAuthenticated from "../middlewares/isAuthenticated";

const commentRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Operations related to comments
 */

/**
 * @swagger
 * /comments/{commentID}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment to delete
 *     responses:
 *       204:
 *         description: Comment deleted successfully.
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Comment not found.
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
commentRouter.delete('/:commentID', isAuthenticated as RequestHandler, deleteComment);

export default commentRouter;
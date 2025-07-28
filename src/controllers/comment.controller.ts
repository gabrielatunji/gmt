
import { Request, Response } from "express";
import { Comment } from "../models/comment.model";
import { AuthenticatedRequest } from "../middlewares/isAuthenticated";
import { User } from "../models/user.model"; 


interface MakeCommentBody {
    body: string;
}

export const makeComment = async (req: Request<{ id: string }, {}, MakeCommentBody>, res: Response): Promise<Response> => {
    const { id: postID } = req.params;
    const { body } = req.body;
    const { user } = req as AuthenticatedRequest; 
    try {
        const commentingUser = await User.findByPk(user.id)
         if (!commentingUser) {
            return res.status(400).json({ message: "Login to add a comment" });
        }
         if (!postID) {
            return res.status(400).json({ message: "Post not found" });
        }

        if (!body) {
           return res.status(400).json({ message: "Comment body is required" });
        }

        // Create a comment associated with a post
        const comment = await Comment.create({
            postID: postID,
            userID: commentingUser.id,
            body: body
        });

        return res.status(201).json({ message: "Comment created successfully", comment });
    } catch (error: any) {
        console.error("Error making comment:", error);
        return res.status(500).json({ message: "Failed to create comment", error: error.message });
    }
};

export const deleteComment = async (req: Request<{id:string}, {}, {}>, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: "Comment ID is required" });
        }

        const deletedComment = await Comment.destroy({ where: { id:id } });

        if (deletedComment === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }

        return res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error: any) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Failed to delete comment", error: error.message });
    }
};


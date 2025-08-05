
import { Request, RequestHandler, Response } from "express";
import { Comment } from "../models/comment.model";
import { AuthenticatedRequest } from "../middlewares/isAuthenticated";
import { User } from "../models/user.model"; 
import { Admin } from "../models/admin.model";


interface MakeCommentBody {
    body: string;
}

export const makeComment = async (req: Request<{ postID: string }, {}, MakeCommentBody>, res: Response): Promise<Response> => {
    const { postID } = req.params;
    const { body } = req.body;
    const { user } = req as unknown as AuthenticatedRequest; 
    try {
        const commentingUser = await User.findByPk(user.userID)
         if (!commentingUser) {
            return res.status(400).json({ message: "Login to add a comment" });
        }
        
         if (!postID) {
            return res.status(400).json({ message: "Post not found" });
        }

        if (!body) {
           return res.status(400).json({ message: "Comment body is required" });
        }

        
        const comment = await Comment.create({
            postID: postID,
            userID: commentingUser.userID,
            body: body
        });

        return res.status(201).json({ message: "Comment created successfully", comment });
    } catch (error: any) {
        console.error("Error making comment:", error);
        return res.status(500).json({ message: "Failed to create comment", error: error.message });
    }
};


export const deleteComment = async (req: Request<{commentID: string}, {}, {}>, res: Response): Promise<Response> => {
    const { commentID } = req.params;
    const { user } = req as unknown as AuthenticatedRequest;

    try {
        if (!commentID) {
            return res.status(400).json({ message: "Comment ID is required" });
        }

        const commentToDelete = await Comment.findByPk(commentID);

        if (!commentToDelete) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const isAdmin = await Admin.findByPk(user.userID);

        
        //Delete if user is an admin or owner of the comment
        if (!isAdmin && commentToDelete.userID !== user.userID) {
            return res.status(403).json({ message: "Forbidden: You do not have permission to delete this comment." });
        }

        const deletedRowCount = await Comment.destroy({ where: { commentID } });

        if (deletedRowCount === 0) {
            return res.status(404).json({ message: "Comment not found or already deleted." });
        }

        return res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error: any) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Failed to delete comment", error: error.message });
    }
};
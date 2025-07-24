
import { Request, Response } from "express";
import { Comment } from "../models/comment.model";


interface MakeCommentBody {
    userID: string;
    body: string;
}

export const makeComment = async (req: Request<{ id: string }, {}, MakeCommentBody>, res: Response): Promise<Response> => {
    const { id: postID } = req.params;
    const { userID, body } = req.body;
    try {
        if (!postID) {
            return res.status(400).json({ message: "Post ID is required" });
        }
         if (!userID) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!body) {
           return res.status(400).json({ message: "Comment body is required" });
        }

        // Create a comment associated with a post
        const comment = await Comment.create({
            postID: postID,
            userID: userID,
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


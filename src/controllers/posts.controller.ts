import { Request, Response } from 'express';
import { Post } from '../models/posts.model';
import { User } from '../models/user.model';
import generatePostID from '../utils/nanoid'; 
import { AuthenticatedRequest } from '../middlewares/isAuthenticated';
import { uploadFile } from '../services/backblaze';
import { Admin } from '../models/admin.model';
import fs from 'fs';

interface NewPost {
    title: string;
    body: string;
}


export const createPost = async (req: Request<{}, {}, NewPost>, res: Response): Promise<Response> => {
    const { title, body } = req.body;
    const { user } = req as AuthenticatedRequest; 

    try {
        if (!title || !body) {
            return res.status(400).json({ message: 'Title and body are required' });
        }

        const postingUser = await User.findByPk(user.userID);

        if (!postingUser) {
            return res.status(404).json({ message: 'Login to make a post' });
        }
        let attachmentURL = null;
        if (req.file) {
            const bucketId = process.env.BACKBLAZE_BUCKET_ID!;
            const fileName = `${generatePostID()}-${req.file.originalname}`;
            const filePath = req.file.path;

            try {
                // Read the file from disk into a Buffer
                const fileData = fs.readFileSync(filePath);
                attachmentURL = await uploadFile({
                    bucketId: bucketId,
                    fileName: fileName,
                    fileData: fileData,
                    contentType: req.file.mimetype,
                });
                 // Delete the file from the local filesystem AFTER uploading to Backblaze
                 fs.unlinkSync(filePath);
            } catch (uploadError: any) {
                console.error("Error uploading to Backblaze:", uploadError);
                 // Clean up the file on error
                 if (fs.existsSync(filePath)) {
                     fs.unlinkSync(filePath);
            }
                return res.status(500).json({ message: 'Failed to upload attachment', error: uploadError.message });
        }
        }
        const postID = generatePostID();
        const newPost = await Post.create({
            postID: postID,
            userID: postingUser.userID,
            title,
            body,
            attachment: attachmentURL,
        });

        return res.status(201).json({ message: 'Post created successfully', post: newPost }); 
    } catch (error: any) {
        console.log('Error creating post:', error);
        return res.status(500).json({ message: 'Failed to create post', error: error.message });
    }
};

interface EditPost {
    newTitle?: string;
    newBody?: string;
    newAttachment?: string | null;
}

export const editPost = async (req: Request<{ postID: string }, {}, EditPost>,res: Response): Promise<Response> => {
    const { postID } = req.params;
    const { user } = req as unknown as AuthenticatedRequest;
    const { newTitle, newBody, newAttachment } = req.body;

    try {
        if (!postID) {
            return res.status(400).json({ message: 'PostID is required' });
        }

        const postToEdit = await Post.findByPk(postID);

        if (!postToEdit) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (postToEdit.userID !== user.userID) {
            return res.status(401).json({ message: "Unauthorized: You're unauthorized to edit this post" });
        }

        // Only update fields that are provided
        if (typeof newTitle !== 'undefined') postToEdit.title = newTitle;
        if (typeof newBody !== 'undefined') postToEdit.body = newBody;
        if (typeof newAttachment !== 'undefined') postToEdit.attachment = newAttachment;

        await postToEdit.save();

        return res.status(200).json({ message: "Post edited successfully", post: postToEdit });
    } catch (error: any) {
        console.error("Error editing post:", error);
        return res.status(500).json({ message: 'Failed to edit post', error: error.message });
    }
};

export const deletePost = async (req: Request<{ postID: string }, {}, {}>, res: Response): Promise<Response> => {
    const { postID } = req.params;
    const { user } = req as unknown as AuthenticatedRequest;
    try {
        if(!postID){
            return res.status(400).json({message: 'PostID is required'});
        }

        const postToDelete = await Post.findByPk(postID);

        if(!postToDelete){
            return res.status(404).json({message: 'Post not found'});
        }

        const isAdmin = await Admin.findByPk(user.userID); 

        if (!isAdmin && postToDelete.userID !== user.userID) {
            return res.status(401).json({ message: "Unathorized: You're not authorized to delete this post" });
        }

        const deletedPost = await Post.destroy({ where: { postID } });

        if (deletedPost === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (error: any) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ message: "Failed to delete post", error: error.message });
    }
};



export const getAllPosts = async (req: Request, res: Response) => {
    const currentPage = parseInt(req.query.page as string, 10) || 1;
    const postPerPage = 10;
    const offset = (currentPage - 1) * postPerPage;
    try {
        const { count, rows: posts } = await Post.findAndCountAll({
            limit: postPerPage,
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        const totalPages = Math.ceil(count / postPerPage);
        return res.status(200).json({
            posts,
            currentPage,
            totalPages,
            totalPosts: count
        });
    } catch (error: any) {
        console.log('Error fetching posts:', error);
        return res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
    }
};

export const getSinglePostByID = async (req: Request<{ postID: string }>, res: Response) => {
    const { postID } = req.params;
    try {
        if (!postID) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        const post = await Post.findByPk(postID);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json({ post });
    } catch (error: any) {
        console.log('Error fetching post:', error);
        return res.status(500).json({ message: 'Failed to fetch post', error: error.message });
    }
};


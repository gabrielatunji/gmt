import { Request, Response } from 'express';
import { Post } from '../models/posts.model';
import generatePostID from '../utils/nanoid'; 

interface NewPost {
    title: string;
    body: string;
    attachment?: string;
}

export const createPost = async (req: Request<{}, {}, NewPost>, res: Response): Promise<Response> => {
    const { title, body, attachment } = req.body;
    try {
        if (!title || !body) {
            return res.status(400).json({ message: 'Title and body are required' });
        }

        const postID = generatePostID();
        const newPost = await Post.create({
            postID: postID,
            userID: "temp", // requires userID
            title,
            body,
            attachment
        });

        return res.status(201).json({ message: 'Post created successfully', post: newPost }); 
    } catch (error: any) {
        console.log('Error creating post:', error);
        return res.status(500).json({ message: 'Failed to create post', error: error.message });
    }
};


export const deletePost = async (req: Request<{id:string}, {}, {}>, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        const deletedPost = await Post.destroy({ where: { postID: id } });

        if (deletedPost === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (error: any) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ message: "Failed to delete post", error: error.message });
    }
};



exports.getAllPosts = async (req: Request, res: Response) => {
    const currentPage = parseInt(req.query.page as string, 10) || 1; //default is 1
    const postPerPage = 10;
    const offset = (currentPage - 1) * postPerPage;
    try {
        const { count, rows: posts } = await Post.findAndCountAll({
            limit: postPerPage,
            offset: offset,
            order: [['createdAt', 'DESC']] // Sort by createdAt, latest first 
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

exports.getSinglePostByID = async (req: Request<{id:string}>, res: Response) => {
    const { id } = req.params;
    try{
        if (!id) {
        return res.status(400).json({ message: 'Post ID is required' });
        }

        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json({ post });
    } catch (error: any) {
        console.log('Error fetching post:', error);
        return res.status(500).json({ message: 'Failed to fetch post', error: error.message });
    }
};


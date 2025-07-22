import { Request, Response } from 'express';
import  Post from '../models/posts.model';
import generatePostID from '../utils/nanoid'; 

exports.createPost = async (req: Request, res: Response) => {
    const { title, body } = req.body;
    try {
        if (!title || !body) {
            return res.status(400).json({ message: 'Title and body are required' });
        }

        const postID =  generatePostID(); 
        const newPost = await Post.create({
            id : postID, 
            title,
            body,
        });

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error: any) {
        console.log('Error creating post:', error);
        res.status(500).json({ message: 'Failed to create post', error: error.message });
    }
    return; 
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
        res.status(200).json({
            posts,
            currentPage,
            totalPages,
            totalPosts: count
        });
    } catch (error: any) {
        console.log('Error fetching posts:', error);
        res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
    }
};

exports.getSinglePostByID = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        if (!id) {
        return res.status(400).json({ message: 'Post ID is required' });
        }

        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ post });
    } catch (error: any) {
        console.log('Error fetching post:', error);
        res.status(500).json({ message: 'Failed to fetch post', error: error.message });
    }
    return; 
};



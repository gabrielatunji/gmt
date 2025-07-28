import { Request, Response } from 'express';
import { Admin } from '../models/admin.model';
import { hashPassword, confirmPassword } from '../utils/bcrypt';
import { Post } from '../models/posts.model';
import { Comment } from '../models/comment.model';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken'

interface SignupRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const signupAdmin = async (req: Request<{}, {}, SignupRequestBody>, res: Response): Promise<Response> => {
  const { email, password, firstName, lastName } = req.body;
    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists with this email" });
        }

        const hashedPassword = await hashPassword(password);

        const newAdmin = await Admin.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        return res.status(201).json({ message: "Admin created successfully", admin: newAdmin });

    } catch (error: any) {
        console.error("Error signing up admin:", error);
        return res.status(500).json({ message: "Failed to create admin", error: error.message });
    }
};

interface LoginRequestBody {
    email: string,
    password: string
}

 export const adminLogin = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const passwordMatch = await confirmPassword(password, (admin as any).password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const payload: JwtPayload = {
                    id: admin.id,
                    email: admin.email,
                    firstName: admin.firstName,
        };
        
        const options: jwt.SignOptions = {
                expiresIn: '1h',
        };
        
        const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                console.error("Login error: JWT_SECRET is not set.");
                return res.status(500).json({ message: "Server configuration error." });
            }
        
        const token = jwt.sign(payload, jwtSecret as Secret, options);
        return res.status(200).json({ message: "Login successful", admin , token});

    } catch (error: any) {
        console.error("Error logging in admin:", error);
        return res.status(500).json({ message: "Failed to login", error: error.message });
    }
};

export const adminDeletePost = async (req: Request<{id:string}>, res: Response): Promise<Response> => {
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

export const adminDeleteComment = async (req: Request<{id:string}>, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: "Comment ID is required" });
        }

        const deletedComment = await Comment.destroy({ where: { id } });

        if (deletedComment === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }

        return res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error: any) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Failed to delete comment", error: error.message });
    }
};


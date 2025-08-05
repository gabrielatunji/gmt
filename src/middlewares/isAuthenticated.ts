import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.model';

dotenv.config();

// Custom type for authenticated user data
export interface AuthenticatedUser {
  userID: string;
  email: string;
  firstName: string;
}

// Extend Express Request type with `user`
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

const isAuthenticated = async (req: AuthenticatedRequest, res: Response, next:NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(500).json({ message: 'JWT secret not set in environment' });
      return; 
    }

    const decoded = jwt.verify(token, jwtSecret) as { id: string };

    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return; 
    }

    // Attach minimal user info to req.user
    req.user = {
      userID: user.userID,
      email: user.email,
      firstName: user.firstName,
    };

    next();
  } catch (error: any) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
    return; 
  }
};

export default isAuthenticated;

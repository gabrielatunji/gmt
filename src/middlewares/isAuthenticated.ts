import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.model';

dotenv.config();

//declare and export the AuthenticatedRequest interface for use in user controller 
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        firstName: string;
    };
}


const isAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    const authHeader = req.headers.authorization;

   
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required: No token provided or malformed header' });
    }

    
    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET as Secret;

    if (!jwtSecret) {
        console.error("Authentication error: JWT_SECRET is not set.");
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    try {
        
        const decoded = jwt.verify(token, jwtSecret) as { id: string; email: string; firstName: string };

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed: User not found' });
        }

        // Attach fresh user information from the database to the request object.
        // This is safer than using the potentially stale data from the token payload.
        req.user = {
            id: user.id,
            email: user.email,
            firstName: user.firstName
        };

        next();

    } catch (error: any) {
        console.error("Authentication error:", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Authentication failed: Token has expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Authentication failed: Invalid token' });
        }
        return res.status(401).json({ message: 'Authentication failed', error: error.message });
    }
};

export default isAuthenticated;
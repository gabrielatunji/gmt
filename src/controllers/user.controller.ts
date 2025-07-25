import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { hashPassword, confirmPassword } from '../utils/bcrypt';
import jwt, { Secret, JwtPayload, SignOptions } from 'jsonwebtoken'; 
import dotenv from 'dotenv'
dotenv.config(); 

interface SignupRequestBody {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    paymentStatus?: string;
    paymentDate?: Date;
    isSubscribed?: boolean;
    tx_Ref?: string; 
}

export const userSignup = async (req: Request<{}, {}, SignupRequestBody>, res: Response): Promise<Response> => {
    const { email, password, firstName, lastName, paymentStatus, paymentDate, isSubscribed, tx_Ref } = req.body;
    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            paymentStatus,
            paymentDate,
            isSubscribed,
            tx_Ref
        });

        return res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error: any) {
        console.error("Error signing up user:", error);
        return res.status(500).json({ message: "Failed to create user", error: error.message });
    }
};

interface LoginRequestBody {
    email: string,
    password: string
}

export const userLogin = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = await confirmPassword(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const payload: JwtPayload = {
            userID: user.id,
            email: user.email,
            firstName: user.firstName,
            };

        const options: jwt.SignOptions = {
            expiresIn: '1d',
            };
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, jwtSecret as Secret, options); 

        return res.status(200).json({ message: "Login successful", user, token });

    } catch (error: any) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Failed to login", error: error.message });
    }
};
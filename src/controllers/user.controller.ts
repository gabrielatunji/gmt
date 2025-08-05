import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { hashPassword, confirmPassword } from '../utils/bcrypt';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generatePaymentLink } from '../services/flutterwave';
import { AuthenticatedRequest } from '../middlewares/isAuthenticated';
import { v7 as uuidv7 } from 'uuid'; 

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
    const { email, password, firstName, lastName } = req.body;
    try {
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await hashPassword(password);
        const userID = 'user-'+uuidv7();

        const newUser = await User.create({
            ...req.body,
            userID: userID,
            password: hashedPassword,
        });

        return res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error: any) {
        console.error("Error signing up user:", error);
        return res.status(500).json({ message: "Failed to create user", error: error.message });
    }
};


interface LoginRequestBody {
    email: string;
    password: string;
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
            id: user.userID,
            email: user.email,
            firstName: user.firstName,
        };

        const options: jwt.SignOptions = {
            expiresIn: '1d',
        };

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("Login error: JWT_SECRET is not set.");
            return res.status(500).json({ message: "Server configuration error." });
        }

        const token = jwt.sign(payload, jwtSecret as Secret, options);

        return res.status(200).json({ message: "Login successful", user: user.firstName, token });

    } catch (error: any) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Failed to login", error: error.message });
    }
};

// Define the PaymentRequestBody interface for the request body
interface PaymentRequestBody {
    amount: number;
}

// Use the AuthenticatedRequest interface for the Request object itself
export const userSubscriptions = async (req: Request, res: Response): Promise<Response> => {
    const { user } = req as AuthenticatedRequest; 

    try {
        if(!user){
            return res.status(404).json({message: 'Unauthorized'})
        }
        const payingUser = await User.findByPk(user.userID);
        if (!payingUser) {
            return res.status(404).json({ message: 'User associated with this token no longer exists.' });
        }

        // Access the subscription amount from the request body
        const { amount } = req.body as PaymentRequestBody;
        
        const paymentLink = await generatePaymentLink({
            email: user.email,
            amount: amount, // Use the amount from the request body
        });
        await payingUser.save();

        return res.status(200).json({ message: 'Payment initiated successfully', paymentLink: paymentLink });

    } catch (error: any) {
        console.error("Error initiating payment:", error);
        return res.status(500).json({ message: "Failed to initiate payment", error: error.message });
    }
};


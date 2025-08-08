import dotenv from 'dotenv';
import axios from 'axios';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

dotenv.config(); 

interface GeneratePaymentLinkPayload {
  email: string;
  amount: number;
  tx_Ref: string;
}
const generatePaymentLink = async (payload: GeneratePaymentLinkPayload): Promise<string> => {
  try {
    const user = await User.findOne({ where: { email: payload.email } });
        if (!user) {
            throw new Error("User not found");
        }

    const amount = payload.amount;

        const response = await axios.post(
            'https://api.flutterwave.com/v3/payments',
            {
                tx_Ref: payload.tx_Ref,
                amount,
                currency: 'NGN',
                redirect_url: 'https://gmt.onrender.com', // frontend confirmation url
                customer: {
                    email: user.email,
                    name: user.firstName
                },
                customizations: {
                    title: 'GMT Payment',
                    description: `Payment for ${user.firstName} Monthly Subscription` || 'GMT Subscription',
                    logo: 'https://res.cloudinary.com/dwx1tdonc/image/upload/v1753439314/GMT_pd1yxo.png',
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Payment link generated:', (response.data as any).data.link);
        return (response.data as any).data.link;
  } catch (err: any) {
        console.error('Error generating payment link:', err.response?.data || err.message);
        throw err;
    }
};

export { generatePaymentLink };

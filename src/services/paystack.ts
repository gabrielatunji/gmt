import axios from 'axios';
import dotenv from 'dotenv'; 

dotenv.config(); 

interface generatePaymentLinkPayload {
    email: string; 
    amount: number; 
    tx_Ref: string; 

}

interface PaystackPaymentLinkResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

const  PaystackPaymentLink = async (payload: generatePaymentLinkPayload): Promise<PaystackPaymentLinkResponse>  => {
  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        amount: payload.amount * 100, // Amount in kobo
        email: payload.email,
        reference: payload.tx_Ref,
        callback_url: 'https://project-gmt-production.up.railway.app' //frontend payment success page
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Paystack Payment link generated:', (response.data as PaystackPaymentLinkResponse).data.authorization_url)
    return response.data as PaystackPaymentLinkResponse;
  } catch (error: any) {
    console.error('Error generating Paystack payment link:', error.response ? error.response.data : error.message);
    throw new Error(error.response ? JSON.stringify(error.response.data) : error.message);
  }
}

export { PaystackPaymentLink };
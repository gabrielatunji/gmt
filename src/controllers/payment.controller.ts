import { Request, Response } from "express";
import { User } from '../models/user.model'; 

export const handleFlutterwaveWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['verif-hash'];

    if (!signature || signature !== process.env.FLW_WEBHOOK_SECRET) {
        return res.status(401).send('Unauthorized - Invalid signature');
    }

    const payload = req.body;
    console.log(payload); 

    if (payload.event === 'charge.completed') {
      const txRef = payload.data.tx_ref;
      const status = payload.data.status;
      const amount = payload.data.amount;
      const email = payload.data.customer.email;

        if (status === 'successful') {

            const payingUser = await User.findOne({ where: { subscriptionTxRef: txRef } }); 
            console.log(payingUser); 
            if (!payingUser) { 
                    return res.status(404).send('User not found');
                }

            payingUser.isSubscribed = true;

                 // Check if user has an active subscription
            if (payingUser.nextSubscription && payingUser.nextSubscription > new Date()) {
                 // Extend the subscription by 30 days if there is an active subscription
                payingUser.nextSubscription = new Date(payingUser.nextSubscription.getTime() + 30 * 24 * 60 * 60 * 1000);
            } else {
                // Start a new subscription
                payingUser.nextSubscription = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            }

            await payingUser.save();

            console.log(`Payment verified and recorded for ${email}, amount paid: ${amount}`);
            return res.status(200).json({ success: true });
        }
    }
  } catch (error) {
    console.log('Error processing webhook:', error);
    return res.status(500).send('Internal server error');
  }
  return res.status(200).send('Webhook received');

}; 

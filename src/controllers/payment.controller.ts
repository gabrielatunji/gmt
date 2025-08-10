import { Request, Response } from "express";
import { User } from '../models/user.model'; 
import { ProcessedTransaction } from "../models/processedtxns.model";



//Learnt about idempotency and tried to make the webhook handler idempotent
export const handleFlutterwaveWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['verif-hash'];

    if (!signature || signature !== process.env.FLW_WEBHOOK_SECRET) {
        return res.status(401).send('Unauthorized - Invalid signature');
    }

    const payload = req.body; 
    //console.log(payload) //DO NOT USE IN PROD, log in development ONLY for testing

     if (payload.event !== 'charge.completed') {
      return res.status(200).send('Event ignored');
     }

      const txRef = payload.data.tx_ref;
      const status = payload.data.status;
      const amount = payload.data.amount;
      const email = payload.data.customer.email;

        if (status !== 'successful') {
            console.log('Payment not successful:', payload.data);
            return res.status(200).send('Payment not successful');
        }

        //check if transaction is already processed
        const alreadyProcessed = await ProcessedTransaction.findOne({ where: { txRef } });

        if (alreadyProcessed) {
            console.log('Transaction already processed:', txRef);
            return res.status(200).send('Transaction already processed');
        }

        const payingUser = await User.findOne({ where: { subscriptionTxRef: txRef } }); 
          if (!payingUser) { 
                    return res.status(404).send('User not found');
          }

          payingUser.isSubscribed = true;

                 // Check if user has an active subscription
          if (payingUser.nextSubscription && payingUser.nextSubscription > new Date()) {
                 // Extend the subscription by 30 days if there is an active subscription
                payingUser.nextSubscription = new Date(payingUser.nextSubscription.getTime() + 30 * 24 * 60 * 60 * 1000);
          } else {
                // or start a new subscription
                payingUser.nextSubscription = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          }
          await payingUser.save();
          await ProcessedTransaction.create({ 
                txRef,
                userID: payingUser.userID
                 });

        console.log(`Payment verified and recorded for ${payingUser.email}, amount paid: ${amount}`);
        return res.status(200).json({ success: true });
  } catch (error) {
    console.log('Error processing webhook:', error);
    return res.status(500).send('Internal server error');
  }

}; 

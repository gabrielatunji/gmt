import { Request, Response } from "express";
import { User } from '../models/user.model'; 
import { ProcessedTransaction } from "../models/processedtxns.model";
import crypto from 'crypto';

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
                    console.log('User not found for transaction', txRef);
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


export const handlePaystackWebhook = async (req: Request, res: Response) => {
  try {
    // Verify Paystack signature
    const secret = process.env.PAYSTACK_SECRET_KEY; 
    const hash = crypto.createHmac('sha512', secret!).update(JSON.stringify(req.body)).digest('hex');

        if (hash !== req.headers['x-paystack-signature']) {
              return res.status(401).send('Unauthorized - Invalid signature');
            }

    const payload = req.body;
    console.log(payload); //Test mode, to see paystack webhook structure

    
    if (payload.event !== 'charge.success') {
        return res.status(200).send('Event ignored')
        }

      const transaction = payload.data;
      const txRef = transaction.reference; 
      const amount = transaction.amount / 100; // Convert Amount back to Naira
      const email = transaction.customer.email;

      // Check if transaction already processed
      const alreadyProcessed = await ProcessedTransaction.findOne({ where: { txRef } });
      if (alreadyProcessed) {
        console.log('Transaction already processed:', txRef);
        return res.status(200).send('Transaction already processed');
}

      const payingUser = await User.findOne({ where: { subscriptionTxRef: txRef } });
      if (!payingUser) {
        console.log('User not found for transaction:', txRef);
        return res.status(404).send('User not found'); 
      }

      payingUser.isSubscribed = true;

      // Correctly calculate nextSubscription
      if (payingUser.nextSubscription && payingUser.nextSubscription > new Date()) {
        payingUser.nextSubscription = new Date(payingUser.nextSubscription.getTime() + 30 * 24 * 60 * 60 * 1000);
      } else {
        payingUser.nextSubscription = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
      await payingUser.save();

      // Mark the transaction as processed
      await ProcessedTransaction.create({
        txRef: txRef,
        userID: payingUser.userID,
      });

      console.log(`Paystack payment verified and recorded for ${email}, amount paid: ${amount}`);
      return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error processing Paystack webhook:', error);
    return res.status(500).send('Paystack webhook processing error');
  }
};


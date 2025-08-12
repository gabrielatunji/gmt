import { Request, Response } from "express";
import { User } from '../models/user.model'; 
import { ProcessedTransaction } from "../models/processedtxns.model";
import { AuthenticatedRequest } from "../middlewares/isAuthenticated";
import { FlutterwavePaymentLink } from "../services/flutterwave";
import { PaystackPaymentLink } from "../services/paystack";
import CircuitBreaker  from 'opossum'; 
import { v7 as uuidv7 } from 'uuid'; 
import crypto from 'crypto';


// Define the PaymentRequestBody interface for the request body
interface PaymentRequestBody {
    amount: number;
}


export const userSubscriptions = async (req: Request, res: Response): Promise<Response> => {
    const { user } = req as AuthenticatedRequest; //from isAuthenticated middleware

    try {
            if(!user){
              return res.status(404).json({message: 'Unauthorized'})
            }
        const payingUser = await User.findByPk(user.userID);
            if (!payingUser) {
              return res.status(404).json({ message: 'User not found' });
            }

        // Access the subscription amount from the request body
        const { amount } = req.body as PaymentRequestBody;

        const tx_Ref = 'GMT-' + uuidv7();

        // const FlutterwaveLink = await FlutterwavePaymentLink({
        //     email: user.email,
        //     amount, 
        //     tx_Ref
        // });

        // const PaystackLink = await PaystackPaymentLink({
        //     email: user.email, 
        //     amount, 
        //     tx_Ref
        // }); 

          //Paystack Circuit Breaker Options
        const paystackOptions = {
              timeout: 3000, // If paystack function doesn't complete within 3 seconds, reject it
              errorThresholdPercentage: 50, // When 50% of requests to paystack fail, trip the circuit
              resetTimeout: 10000 // After 10 seconds, try again.
        };

        // Flutterwave Circuit Breaker Options
        const flutterwaveOptions = {
                timeout: 3000,
                errorThresholdPercentage: 50,
                resetTimeout: 10000
        };

  // Wrap the payment link functions in the circuit breaker
        const paystackBreaker = new CircuitBreaker((email: string, amount: number, tx_Ref: string) =>
                PaystackPaymentLink({ email, amount, tx_Ref }), paystackOptions
        );
        const flutterwaveBreaker = new CircuitBreaker((email: string, amount: number, tx_Ref: string) =>
                FlutterwavePaymentLink({ email, amount, tx_Ref }), flutterwaveOptions
        );

        let transaction;
        let attempts = 0;
        const maxAttempts = 2; // Try Paystack, then Flutterwave, then Paystack again, then Flutterwave again (4 total trials before failure)

        // Alternate between Paystack and Flutterwave, up to maxAttempts*2 times
        while (attempts < maxAttempts * 2) {
            try {
                if (attempts % 2 === 0) { // Even attempts: Paystack
                    transaction = await paystackBreaker.fire(user.email, amount, tx_Ref);
                    if (transaction.status) break;
                    throw new Error('Paystack offline');
                } else { // Odd attempts: Flutterwave
                    transaction = await flutterwaveBreaker.fire(user.email, amount, tx_Ref);
                    if (transaction.status) break;
                    throw new Error('Flutterwave offline');
                }
            } catch (err) {
                console.error(attempts % 2 === 0 ? "Paystack offline, switching to Flutterwave" : "Flutterwave offline, switching to Paystack");
                attempts++;
            }
        }

        if (!transaction || !transaction.status) {
            return res.status(500).json({ message: "Both payment providers failed. Please try again later." });
        }

        payingUser.subscriptionTxRef = tx_Ref;
        await payingUser.save();

        return res.status(200).json({ message: 'Payment initiated successfully', PaymentLink: transaction});

      } catch (error: any) {
        console.error("Error initiating payment:", error);
        return res.status(500).json({ message: "Failed to initiate payment", error: error.message });
      }
};





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

    const PaystackIPs = [
            "52.31.139.75",
            "52.49.173.169",
            "52.214.14.220"
          ]; 

    // Get the IP address of the request origin
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; //should simply be req.socket.remotAddress but 
    const clientIP = typeof ip === 'string' ? ip.split(',')[0].trim() : (ip ? ip[0].trim() : null); //'x.forwarded-for' takes care of cases where a proxy is used

        // Whitelist Paystack IP addresses
      if (!clientIP || !PaystackIPs.includes(clientIP)) {
          console.warn(`Unauthorized access: IP ${clientIP} is not whitelisted.`);
          return res.status(403).send('Forbidden - IP not whitelisted');
        }


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


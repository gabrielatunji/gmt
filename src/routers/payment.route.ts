import { Router, RequestHandler } from "express";
import { handleFlutterwaveWebhook, handlePaystackWebhook } from "../controllers/payment.controller";
import { userSubscriptions } from "../controllers/payment.controller";
import  isAuthenticated  from '../middlewares/isAuthenticated'; 
//import { CircuitBreaker } from 'opossum'; 
import { PaystackPaymentLink } from "../services/paystack";
import { FlutterwavePaymentLink } from "../services/flutterwave";
const paymentRouter = Router();


/**
 * @swagger
 * /user/subscribe:
 *   post:
 *     summary: Subscribe a user to a premium plan
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tx_ref:
 *                 type: string
 *                 description: The transaction reference.
 *                 example: MC-1699278277510-9737
 *               paymentStatus:
 *                 type: string
 *                 description: The payment Status.
 *                 example: Subscribed
 *     responses:
 *       200:
 *         description: User subscription updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: User subscription updated successfully
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Missing or invalid JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
paymentRouter.post('/subscribe', isAuthenticated as RequestHandler, userSubscriptions);

paymentRouter.post("/flutterwave/webhook", handleFlutterwaveWebhook);
paymentRouter.post("/paystack/webhook", handlePaystackWebhook); 

export default paymentRouter;



// //CIRCUIT BREAKER IMPLEMENTATION

// // Paystack Circuit Breaker
// const paystackOptions = {
//     timeout: 3000, // If paystack function doesn't complete within 3 seconds, reject it
//     errorThresholdPercentage: 50, // When 50% of requests to paystack fail, trip the circuit
//     resetTimeout: 10000 // After 10 seconds, try again.
// };

// const paystackCircuitBreaker = new CircuitBreaker(PaystackPaymentLink, paystackOptions);

// // Flutterwave Circuit Breaker
// const flutterwaveOptions = {
//     timeout: 3000,
//     errorThresholdPercentage: 50,
//     resetTimeout: 10000
// };

// const flutterwaveCircuitBreaker = new CircuitBreaker(FlutterwavePaymentLink, flutterwaveOptions);

// paymentRouter.post('/initiate-payment', async (req: Request, res: Response) => {
//     try {
//         const { email, amount } = req.body;
//         const callback_url = `${process.env.FRONTEND_URL}/payment/verify`;

//         let transaction;
//         if (paystackCircuitBreaker.isOpen() && !flutterwaveCircuitBreaker.isOpen()) {
//             // If Paystack is down, use Flutterwave
//             console.log("Paystack is down, using Flutterwave");
//             transaction = await flutterwaveCircuitBreaker.fire(email, amount, callback_url);
//             if(transaction.status == false)
//             throw new Error('Flutterwave offline')
//         } else if(!paystackCircuitBreaker.isOpen() && flutterwaveCircuitBreaker.isOpen()){
//              transaction = await paystackCircuitBreaker.fire(email, amount, callback_url);
//               if(transaction.status == false)
//                 throw new Error('Paystack offline')
//         }
        
//         else {
//              try{
//                 transaction = await paystackCircuitBreaker.fire(email, amount, callback_url);
//                  if(transaction.status == false)
//                      throw new Error('Paystack offline')
//              }catch(err){
//                  console.warn("Paystack offline, switching to Flutterwave")
//                 transaction = await flutterwaveCircuitBreaker.fire(email, amount, callback_url);
//                  if(transaction.status == false)
//                     throw new Error('Flutterwave offline')
//              }
             
//         }

//         if (transaction) {
//             console.log(transaction);
//             return res.status(200).json({
//                 authorization_url: transaction.data.link || transaction.data.authorization_url, // Account for the link from flutterwave or auth url from paystack
//                 reference: transaction.data.reference,
//             });
//         } else {
//             return res.status(500).json({ message: 'Payment initiation failed: Both Paystack and Flutterwave are unavailable' });
//         }
//     } catch (error: any) {
//         console.error('Error initiating payment:', error);
//         res.status(500).json({ message: 'Payment initiation failed', error: error.message });
//     }
// });

// export default router;
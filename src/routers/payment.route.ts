import { Router, RequestHandler } from "express";
import { handleFlutterwaveWebhook, handlePaystackWebhook } from "../controllers/payment.controller";
import { userSubscriptions } from "../controllers/payment.controller";
import  isAuthenticated  from '../middlewares/isAuthenticated'; 
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
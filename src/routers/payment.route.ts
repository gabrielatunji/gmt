import { Router } from "express";
import { handleFlutterwaveWebhook, handlePaystackWebhook } from "../controllers/payment.controller";
const paymentRouter = Router();

paymentRouter.post("/flutterwave/webhook", handleFlutterwaveWebhook);
paymentRouter.post("/paystack/webhook", handlePaystackWebhook); 

export default paymentRouter;
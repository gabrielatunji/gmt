import { Router } from "express";
import { handleFlutterwaveWebhook } from "../controllers/payment.controller";
const paymentRouter = Router();

paymentRouter.post("/webhook/flutterwave", handleFlutterwaveWebhook);

export default paymentRouter;

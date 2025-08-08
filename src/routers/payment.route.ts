import { Router } from "express";
import { handleFlutterwaveWebhook } from "../controllers/payment.controller";
const paymentRouter = Router();

paymentRouter.post("/flutterwave/webhook", handleFlutterwaveWebhook);

export default paymentRouter;

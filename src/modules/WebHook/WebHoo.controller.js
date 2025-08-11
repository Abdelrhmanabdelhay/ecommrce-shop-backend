// routes/stripeWebhook.js
import express from "express";
import Stripe from "stripe";
import Order from "../../../DataBase/models/order.model.js";
const webhookrouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe requires the raw body
webhookrouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "paid"
        });

        console.log(`✅ Order ${orderId} marked as paid`);
      }

      if (event.type === "payment_intent.payment_failed") {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;

        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "failed"
        });

        console.log(`❌ Order ${orderId} payment failed`);
      }

      res.json({ received: true });
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

export default webhookrouter;

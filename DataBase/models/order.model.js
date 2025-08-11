import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // The customer placing the order
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true, // Price per unit at the time of purchase
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true, // Sum of all items * quantity
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["stripe", "cash_on_delivery"],
    default: "stripe",
  },
  stripePaymentId: {
    type: String, // Store Stripe PaymentIntent ID
  },
  orderStatus: {
    type: String,
    enum: ["processing", "shipped", "delivered", "cancelled"],
    default: "processing",
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("Order", orderSchema);

import Order from "../../../DataBase/models/order.model.js";
import AppError from "../../../utils/appError.js";
import { notfiyAdmin } from "../../../utils/socket.io.js";
import stripe from 'stripe';
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
// Create a new order
const createOrder = async (req, res, next) => {
try {
    const { products,  shippingAddress } = req.body;
    const userId = req.user._id;
    if(!products || !shippingAddress || !userId) {
        return next(new AppError('All fields are required', 400));
    }
    const totalAmount = products.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (totalAmount <= 0) {
        return next(new AppError('Total amount must be greater than 0', 400));
    }
    const order = await Order.create({
        user: userId,
        products,
        totalAmount,
        shippingAddress,
        paymentStatus: 'pending',
        orderStatus: 'processing',
        paymentMethod: 'stripe' // Default payment method
    });
    const paymentIntent = await stripeClient.paymentIntents.create({
        amount: totalAmount * 100, // Stripe expects amount in cents
        currency: 'usd',
        metadata: { orderId: order._id.toString() }
    });
    order.stripePaymentId = paymentIntent.id;
    await order.save();
    res.status(201).json({
        status: 'success',
        message: 'Order created successfully',
        data: {
            order
        }
    });
}
catch (error) {
    next(new AppError(error.message, 500));
}   
};
export {createOrder};
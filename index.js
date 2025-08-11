import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './src/modules/Users/user.routes.js';
import authenticationRouter from './src/modules/authentication/authentication.routes.js';
import productRouter from './src/modules/Products/product.routes.js';
import sellerRequestRouter from './src/modules/seller-requests/seller-request.routes.js';
import http from 'http';
import { webSocketServer } from './utils/socket.io.js';
import stripewebhookRouter from './src/modules/WebHook/WebHoo.controller.js';
dotenv.config();
// Middleware
const app= express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
// Create HTTP server

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authenticationRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/seller-requests', sellerRequestRouter);
app.use('/api/v1/stripe', stripewebhookRouter);

// socket.io setup
const server = http.createServer(app);
webSocketServer(server);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
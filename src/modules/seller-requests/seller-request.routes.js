import express from 'express';
import {createSellerRequest , getAllSellerRequests, handleSellerRequest } from './seller-request.controller.js';
import verfiyToken from '../../../utils/verfiytoken.js';
import { isAdmin, isUser } from '../../middlewares/auth.middleware.js';
const sellerRequestRouter = express.Router();
sellerRequestRouter.post('/create-seller-request', verfiyToken,isUser, createSellerRequest);
sellerRequestRouter.get('/get-all-seller-requests', verfiyToken, isAdmin,getAllSellerRequests);
sellerRequestRouter.patch('/handle-seller-request/:id', verfiyToken, isAdmin,handleSellerRequest);
export default sellerRequestRouter;
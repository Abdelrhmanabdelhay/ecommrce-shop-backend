import express from 'express';
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    getProductsBySeller,
    rateProduct
} from './product.controller.js';import { isAdmin,isUser,isSeller,isAdminOrSeller } from '../../middlewares/auth.middleware.js';
import verfiyToken from '../../../utils/verfiytoken.js';
import upload from '../../middlewares/multer.middleware.js';
const productRouter = express.Router();
productRouter.post('/create-product',verfiyToken,upload, createProduct);
productRouter.get('/get-allproduct', getAllProducts);
productRouter.get('/get-product-byid/:id', getProductById);
productRouter.put('/update-product/:id', verfiyToken,isAdmin, updateProductById);
productRouter.delete('/delete-prdouct/:id',verfiyToken ,isAdmin, deleteProductById);
productRouter.get('/get-products-by-seller/:sellerId', verfiyToken,isSeller, getProductsBySeller);
productRouter.post('/rate-product/:id', verfiyToken, isUser, rateProduct);
export default productRouter;
import verfiyToken from "../../../utils/verfiytoken";
import { createOrder } from "./order.controller";
import express from "express";
const orderRouter = express.Router();
// Route to create a new order
orderRouter.post("/create" ,createOrder);

export default orderRouter;
import express from "express";
import { createOrder, getOrders, cancelOrder,verifyPayment } from "../controller/OrderController.js";
import { authMiddleware } from "../middleware/authmiddelware.js";

const router = express.Router();

router.post("/create", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getOrders);
router.post("/cancel/:orderId", authMiddleware, cancelOrder);  
router.post("/verify-payment", authMiddleware, verifyPayment);
export default router;
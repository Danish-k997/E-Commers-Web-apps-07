import express from "express";
const router = express.Router();
import { authMiddleware } from "../middleware/authmiddelware.js";
import { addToCart, getCart, removeFromCart } from "../controller/CartController.js";

router.post('/add', authMiddleware, addToCart);
router.get('/:userId', authMiddleware, getCart);
router.post('/remove', authMiddleware, removeFromCart);


export default router
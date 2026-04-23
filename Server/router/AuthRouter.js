import express from "express";
import { register,login,logout,forgotPassword, resetpassword, getUserData, getalluser } from "../controller/AuthController.js";
import {authMiddleware} from "../middleware/authmiddelware.js"
const router = express.Router();
      
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/logout', logout);
router.post('/reset-password/:token', resetpassword);
router.get('/user', authMiddleware, getUserData);
router.get('/alluser', authMiddleware, getalluser);

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
       
export default router;
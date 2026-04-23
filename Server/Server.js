import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import  ProductRoutes from './router/ProductsRouter.js'; 
import AuthRoutes from './router/AuthRouter.js'; 
import CartRoutes from './router/CartRouter.js';
import AddressRoutes from './router/AddressRouter.js';
import OrderRoutes from './router/OrderRouter.js';
import cloudinary from "./Config/cloudinary.js";


const app = express();
const PORT = process.env.PORT || 5000;


// middleware
app.use(cors({
  origin: ["https://si-fi-store-admin-07-git-main-danish-khans-projects-32cebd46.vercel.app", "https://si-fi-store-07.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Router
app.use('/api/products', ProductRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/address', AddressRoutes);
app.use('/api/orders', OrderRoutes);

// mongodb connection
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));


app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
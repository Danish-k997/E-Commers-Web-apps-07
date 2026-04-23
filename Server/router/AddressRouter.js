import express from "express";
import { addAddress, getAddress, updateAddress } from "../controller/AddressController.js";
import { authMiddleware } from "../middleware/authmiddelware.js";

const Router = express.Router();

Router.post("/add", authMiddleware, addAddress);
Router.get("/:userId", authMiddleware, getAddress); 
Router.put("/:addressId",authMiddleware, updateAddress)

export default Router;
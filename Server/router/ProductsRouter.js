import express from "express";

import {
  getProducts,
  addProduct,
  removeProduct,
  UpdateProduct,
  bestSellerProducts,
} from "../controller/ProductsController.js";
import upload from "../multer.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authmiddelware.js";
const router = express.Router();

router.get("/", getProducts);
router.post(
  "/add",
  authMiddleware,
  authorizeRoles("admin"),
  upload.array("images", 5),
  addProduct,
);

router.get("/bestsellers",bestSellerProducts,);

router.delete("/:id", authMiddleware, authorizeRoles("admin"), removeProduct);
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  upload.array("images", 5),
  UpdateProduct,
);

export default router;

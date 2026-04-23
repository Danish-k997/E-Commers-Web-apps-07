import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String], required: true },
  category: { type: String, required: true },
  size: { type: Array, required: true },
  bestseller: { type: Boolean },
  date: { type: Number,default:Date.now(), required: true },
});

const productModel = mongoose.models.products || mongoose.model("products", productSchema);

export default productModel;
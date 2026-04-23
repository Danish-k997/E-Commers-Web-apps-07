import mongoose from "mongoose";
     
const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },                                 
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String, trim: true },               
  },
  { timestamps: true } 
);

export default mongoose.model("Address", addressSchema);

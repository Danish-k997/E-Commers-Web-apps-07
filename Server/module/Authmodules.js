import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  resetToken: { type: String },
  resetTokenExpire: { type: Date },
  googleId: { type: String },
});

const User = mongoose.model("User", UserSchema);


export default User;

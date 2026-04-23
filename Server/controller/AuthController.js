import Authmodel from '../module/Authmodules.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { log } from 'console';

export const register = async (req, res) => {
  try { 
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await Authmodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new Authmodel({
      email,
      password: hashedPassword,
      name,
      role: 'user',
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { Id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  
  
    res.status(201).json({ token, user: { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role } });
  } catch (error) {
    console.log(error); 
    res.status(500).json({ message: error.message });
  }
}


 export const login = async (req, res) => { 
  try {
    const { email, password } = req.body;

    const user = await Authmodel.findOne({ email });
    if (!user) {
  return res.status(404).json({ success: false, message: "User not found" });
}

const match = await bcrypt.compare(password, user.password);
if (!match) {
  return res.status(400).json({ success: false, message: "Wrong password" });
}

    // token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // production = true
      sameSite: "lax",
    });

    res.json({ success: true, token, message: "Login success" });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


export const logout = (req,res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await Authmodel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Token generate
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash token (security)
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetToken = hashedToken;
  user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 min

  await user.save();
     
   let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD
    }
  });

  // Reset link
  const resetUrl = `http://localhost:5174/reset-password/${resetToken}`;

   await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Password Reset",
    text: `Click here to reset: ${resetUrl}`
  });

  

  res.json({ message: "Reset link sent to email" });
};  


 export const resetpassword = async (req, res) => {

  const {token} = req.params;
  const {password} = req.body; 

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await Authmodel.findOne({
    resetToken: hashedToken,
    resetTokenExpire: { $gt: Date.now() }
  }); 
  
  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  } 
  
  user.password = await bcrypt.hash(password, 10);
 
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save(); 

  res.json({ message: "Password reset successful" });

}   


export const getUserData = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await Authmodel
      .findById(userId)
      .select('name email role phone')   
      .lean();                     

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });

  } catch (error) {
    console.error(error);   
    res.status(500).json({ message: "Internal server error" }); 
  }
}   

export const getalluser = async (req, res) => {
  try {
     const users = await Authmodel.find().lean() 
     res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });    
  }
} 

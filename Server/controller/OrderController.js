import Ordermodules from "../module/Ordermodules.js";
import Cart from "../module/Cartmoduls.js";
import products from "../module/Productsmodule.js";
import Razorpay from "razorpay";
import { createHmac } from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items.map((items) => ({
      productId: items.productId._id,
      quantity: items.quantity,
      price: items.productId.price,
    }));

    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const deliveryFee = 20;
    const totalAmount = subtotal + deliveryFee;

    const order = new Ordermodules({
      userId,
      items,
      shippingAddress,
      subtotal,
      deliveryFee,
      totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      status: "pending",
    });
    await order.save();

    if (paymentMethod === "cod") {
      await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
     return res.json({
        success: true,
        order,
        paymentRequired: false,
        message: "Order placed successfully with Cash on Delivery",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: order._id.toString(),
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount * 100,
      currency: "INR",
      paymentRequired: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const userId = req.user.id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const signature = 
      createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment is fake !" });
    }

    const order = await Ordermodules.findByIdAndUpdate(
      orderId,
      {
        $set: {
          paymentStatus: "paid",
          status: "confirmed",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
        },
      },
      { new: true },
    );
     
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } }); 



    res.status(200).json({
      message: "Payment successful!",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ message: "user not found" });
    }

    const orders = await Ordermodules.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Ordermodules.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }
    if (
      order.status === "delivered" ||
      order.status === "cancelled"
    ) {
      return res.status(400).json({
        message: `Order cannot be cancelled — status: ${order.status}`,
      });
    }

    order.status = "cancelled";
    await order.save();
    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

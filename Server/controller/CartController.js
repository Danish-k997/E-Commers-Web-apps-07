import productModel from "../module/Productsmodule.js";
import Cart from "../module/Cartmoduls.js";

export const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  let carts = await Cart.findOne({ userId });
  if (!carts) {
    carts = new Cart({ userId, items: [{ productId, quantity }] });
  } else {
    const itemIndex = carts.items.findIndex(
      (item) => item.productId.toString() === productId.toString(),
    );
    if (itemIndex > -1) {
      carts.items[itemIndex].quantity += quantity;
    } else {
      carts.items.push({ productId, quantity });
    }
  }

  await carts.save();
  res.json({ success: true, carts });
};

export const getCart = async (req, res) => {
  const { userId } = req.params;

  let cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart) {
    cart = {
      userId,
      items: [],
    };
  }

  res.json({ success: true, cart });
};

export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId.toString(),
  );
  await cart.save();
  res.json({ success: true, cart });
};

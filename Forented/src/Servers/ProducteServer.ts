import { API } from "./api.ts";

export const getProducts = () => {
  return API.get("/products");
};

export const bestSellerProducts = () => {
  return API.get("/products/bestsellers");
};

export const getFilters = (
  category: string,
  min: string,
  max: string,
  sort: string,
  page: number,
) => {
  // Axios automatically ?category=Men&min=200... jaisa URL bana deta hai
  return API.get("/products/filters", {
    params: { category, min, max, sort, page },
  });
};

export const registerUser = (
  name: string,
  email: string,
  password: string,
  isAdmin: boolean = false,
) => {
  return API.post("/auth/register", { name, email, password, isAdmin });
};

export const loginUser = (email: string, password: string) => {
  return API.post(
    "/auth/login",
    { email, password },
    { withCredentials: true },
  );
};

export const logoutUser = () => {
  return API.post("/auth/logout", {}, { withCredentials: true });
};

export const forgotPassword = (email: string) => {
  return API.post("/auth/forgot-password", { email });
};

export const resetPassword = (token: string, password: string) => {
  return API.post(`/auth/reset-password/${token}`, { password });
};

export const addtoCart = (
  userId: string,
  productId: string,
  quantity: number,
) => {
  return API.post(
    "/cart/add",
    { userId, productId, quantity },
    { withCredentials: true },
  );
};

export const removeFromCart = (userId: string, productId: string) => {
  return API.post(
    "/cart/remove",
    { userId, productId },
    { withCredentials: true },
  );
};

export const getCart = (userId: string) => {
  return API.get(`/cart/${userId}`, { withCredentials: true });
};

export const addAddress = (
  address: {
    name: string;
    phone: string;
    city: string;
    state: string;
    landmark?: string;
    pincode: string;
    country: string;
  },
  userId: string,
) => {
  return API.post(
    "/address/add",
    {
      userId,
      name: address.name,
      phone: address.phone,
      city: address.city,
      state: address.state,
      landmark: address.landmark,
      pincode: address.pincode,
      country: address.country,
    },
    { withCredentials: true },
  );
};

export const getAddresses = (userId: string) => {
  return API.get(`/address/${userId}`, { withCredentials: true });
};

export const updateAddress = (
  addressId: string, // ← doosra
  formData: {
    name: string;
    phone: string;
    city: string;
    state: string;
    landmark?: string;
    pincode: string;
  },
) => {
  return API.put(
    `/address/${addressId}`,
    { ...formData },
    { withCredentials: true },
  );
};

export const createOrder = (data: {
  shippingAddress: {
    name: string;
    phone: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  paymentMethod: "cod" | "razorpay";
}) => {
  return API.post("/orders/create", data, { withCredentials: true });
};

export const getOrders = () => {
  return API.get("/orders/my-orders", { withCredentials: true });
};

export const cancelorder = (orderId: string) => {
  return API.post(`/orders/cancel/${orderId}`, {}, { withCredentials: true });
};

export const verifyPayment = (data: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  orderId: string;
}) => {
  return API.post("/orders/verify-payment", data, { withCredentials: true });
};

export const getUserData = () => {
  return API.get("/auth/user", { withCredentials: true });
};
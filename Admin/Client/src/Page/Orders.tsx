import { useContext, useEffect } from "react";
import { AdminContext } from "../Context/AdminContext";

type OrderItem = {
  _id: string;
  quantity: number;
  price: number;
  productId?: {
    name?: string;
    images?: string[];
  };
};

type OrderType = {
  _id: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  subtotal?: number;
  deliveryFee?: number;
  totalAmount?: number;
  shippingAddress?: {
    name?: string;
    phone?: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
  };
  items?: OrderItem[];
};

const currency = (value: number) => `Rs. ${value.toLocaleString("en-IN")}`;

const statusClasses = (status?: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === "confirmed") {
    return "bg-green-100 text-green-700";
  }
  if (normalized === "pending") {
    return "bg-yellow-100 text-yellow-700";
  }
  if (normalized === "cancelled") {
    return "bg-red-100 text-red-700";
  }
  return "bg-gray-100 text-gray-700";
};

const paymentClasses = (status?: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === "paid") {
    return "bg-emerald-100 text-emerald-700";
  }
  return "bg-orange-100 text-orange-700";
};

const Orders = () => {
  const context = useContext(AdminContext);
  const ShowOrders = context.ShowOrders;
  const orders = (context.Orders as unknown as OrderType[]) || [];

  useEffect(() => {
    ShowOrders();
  }, [ShowOrders]);

  const confirmedOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "confirmed"
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "pending"
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "cancelled"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <p className="text-sm text-gray-500">
          Track all customer orders, payment state, and delivery progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="mt-2 text-2xl font-semibold text-gray-800">
            {orders.length}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="mt-2 text-2xl font-semibold text-green-600">
            {confirmedOrders}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="mt-2 text-2xl font-semibold text-yellow-600">
            {pendingOrders}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="mt-2 text-2xl font-semibold text-red-600">
            {cancelledOrders}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-5 flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-800">{order._id}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusClasses(order.status)}`}
                  >
                    {order.status}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${paymentClasses(order.paymentStatus)}`}
                  >
                    Payment: {order.paymentStatus}
                  </span>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase text-indigo-700">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-700">Customer</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Name: </span>
                    {order.shippingAddress?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Phone: </span>
                    {order.shippingAddress?.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Address: </span>
                    {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                    - {order.shippingAddress?.pincode}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">Landmark: </span>
                    {order.shippingAddress?.landmark}
                  </p>
                </div>

                <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-700">Order Summary</p>
                  <p className="text-sm text-gray-600">
                    Items:{" "}
                    <span className="font-medium text-gray-800">
                      {order.items?.length}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Subtotal:{" "}
                    <span className="font-medium text-gray-800">
                      {currency(order.subtotal || 0)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Delivery Fee:{" "}
                    <span className="font-medium text-gray-800">
                      {currency(order.deliveryFee || 0)}
                    </span>
                  </p>
                  <p className="pt-1 text-base font-semibold text-gray-900">
                    Total: {currency(order.totalAmount || 0)}
                  </p>
                </div>

                <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-700">Products</p>
                  {order.items?.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <img
                        src={item.productId?.images?.[0]}
                        alt={item.productId?.name}
                        className="h-14 w-14 rounded-md border border-gray-200 object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {item.productId?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} | Price: {currency(item.price || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;

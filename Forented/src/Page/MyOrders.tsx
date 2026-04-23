import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../Context/ShopContext"
import { toast } from "react-toastify"
import { NavLink } from "react-router-dom";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
type SortOption = "newest" | "oldest" | "status";

const MyOrders = () => {
  const context = useContext(ShopContext);
  const orders = context?.orders ?? [];
  const cancelOrder = context?.cancelOrder;
  const fetchOrders = context?.fetchOrders;
  
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        await fetchOrders?.();
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [fetchOrders]);

  const handleCancel = async (orderId: string) => {
    if (!cancelOrder || !orderId) return;
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      await fetchOrders?.();
    } catch (error) {
      toast.error("Failed to cancel order");
      console.error(error);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, { bg: string; text: string; icon: string }> = {
      pending: { bg: "bg-yellow-50", text: "text-yellow-700", icon: "⏳" },
      confirmed: { bg: "bg-blue-50", text: "text-blue-700", icon: "✓" },
      shipped: { bg: "bg-purple-50", text: "text-purple-700", icon: "📦" },
      delivered: { bg: "bg-green-50", text: "text-green-700", icon: "✓✓" },
      cancelled: { bg: "bg-red-50", text: "text-red-700", icon: "✕" },
    };
    return colors[status] || { bg: "bg-gray-50", text: "text-gray-700", icon: "?" };
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border border-blue-300",
      shipped: "bg-purple-100 text-purple-800 border border-purple-300",
      delivered: "bg-green-100 text-green-800 border border-green-300",
      cancelled: "bg-red-100 text-red-800 border border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border border-gray-300";
  };

  const getStatusSteps = (status: OrderStatus) => {
    const steps = ["confirmed", "shipped", "delivered"];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      step,
      completed: index <= currentIndex && status !== "cancelled",
      active: index === currentIndex,
    }));
  };

  const formatDate = (date: string | Date) => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const sortedAndFilteredOrders = orders
    .filter(
      (order) =>
        filterStatus === "all" || (order.status as OrderStatus) === filterStatus
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime();
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            My Orders
          </h1>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm md:text-base">
            Track and manage all your orders in one place
          </p>
        </div>

        {/* Controls Section */}
        {!loading && orders.length > 0 && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 md:rounded-3xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-700 sm:text-sm">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="mt-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none hover:border-slate-400 focus:border-orange-500 sm:text-sm"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-700 sm:text-sm">
                  Filter by status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as OrderStatus | "all")}
                  className="mt-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none hover:border-slate-400 focus:border-orange-500 sm:text-sm"
                >
                  <option value="all">All orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-slate-600 sm:text-sm">
              Showing <span className="font-semibold text-slate-900">{sortedAndFilteredOrders.length}</span> of{" "}
              <span className="font-semibold text-slate-900">{orders.length}</span> orders
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-12 text-center sm:py-16 md:rounded-3xl">
            <div className="mx-auto mb-4 text-4xl sm:text-5xl">📦</div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl md:text-2xl">
              No orders yet
            </h2>
            <p className="mt-2 text-xs text-slate-600 sm:text-sm md:text-base">
              Start shopping to see your orders here
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4 sm:space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 md:rounded-3xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="h-5 w-32 rounded-lg bg-slate-200" />
                  <div className="h-6 w-20 rounded-full bg-slate-200" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-5/6 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Orders List */}
        {!loading && sortedAndFilteredOrders.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            {sortedAndFilteredOrders.map((order) => {
              const status = (order.status as OrderStatus) || "pending";
              const statusColor = getStatusColor(status);
              const steps = status !== "cancelled" ? getStatusSteps(status) : [];

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md sm:rounded-3xl"
                >
                  {/* Order Header */}
                  <div className={`border-b border-slate-200 ${statusColor.bg} px-4 py-4 sm:px-6 sm:py-5`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-slate-600 sm:text-sm">
                            Order ID:
                          </p>
                          <p className="font-mono text-sm font-bold text-slate-900 sm:text-base">
                            #{order._id?.slice(-8).toUpperCase() || "N/A"}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                          {order.createdAt
                            ? `Placed on ${formatDate(order.createdAt)}`
                            : "Date not available"}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide sm:px-4 sm:py-2 ${getStatusBadgeClass(
                          status
                        )}`}
                      >
                        {statusColor.icon} {status}
                      </span>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  {steps.length > 0 && status !== "cancelled" && (
                    <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
                      <p className="mb-3 text-xs font-semibold text-slate-700 sm:text-sm">
                        Delivery Progress
                      </p>
                      <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                          <div key={step.step} className="flex flex-col items-center">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold sm:h-10 sm:w-10 sm:text-sm ${
                                step.completed
                                  ? "border-green-500 bg-green-50 text-green-700"
                                  : step.active
                                    ? "border-orange-500 bg-orange-50 text-orange-700"
                                    : "border-slate-300 bg-slate-50 text-slate-400"
                              }`}
                            >
                              {step.completed ? "✓" : step.active ? "●" : "○"}
                            </div>
                            <p className="mt-2 text-xs capitalize text-slate-600 sm:text-xs">
                              {step.step}
                            </p>
                            {index < steps.length - 1 && (
                              <div
                                className={`my-2 h-8 w-0.5 sm:h-10 ${
                                  step.completed ? "bg-green-500" : "bg-slate-300"
                                }`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products Section */}
                  <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
                    <p className="mb-3 text-xs font-semibold text-slate-700 sm:text-sm">
                      Order Items ({order.items?.length || 0})
                    </p>
                    <div className="space-y-3">
                      {order.items?.map((item, index) => {
                        const product = item.productId as Record<string, unknown>;
                        const imageUrl =
                          (product?.images as string[])?.[0] || "https://via.placeholder.com/80";

                        return (
                          <div
                            key={index}
                            className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:gap-4 sm:p-4"
                          >
                            <img
                              src={imageUrl}
                              alt={typeof product?.name === "string" ? product.name : "Product"}
                              className="h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-20"
                            />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-slate-900 sm:text-sm">
                                {typeof product?.name === "string"
                                  ? product.name
                                  : "Unknown Product"}
                              </p>
                              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                                Quantity: <span className="font-semibold">{item.quantity}</span>
                              </p>
                              <p className="mt-1 text-xs font-bold text-orange-600 sm:text-sm">
                                ₹{typeof item.price === "number" ? item.price.toFixed(2) : "0.00"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-600 sm:text-sm">
                        <span>Subtotal</span>
                        <span>₹{typeof order.totalAmount === "number" ? (order.totalAmount - 20).toFixed(2) : "0.00"}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600 sm:text-sm">
                        <span>Delivery Fee</span>
                        <span>₹20.00</span>
                      </div>
                      <div className="border-t border-slate-200 pt-2">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span className="text-xs sm:text-sm">Total Amount</span>
                          <span className="text-sm text-orange-600 sm:text-base">
                            ₹{typeof order.totalAmount === "number"
                              ? order.totalAmount.toFixed(2)
                              : "0.00"}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-slate-600 sm:text-sm">
                          <span className="font-semibold text-slate-700 capitalize">
                            {typeof order.paymentMethod === "string"
                              ? order.paymentMethod
                              : "Unknown"}
                          </span>{" "}
                          —{" "}
                          <span
                            className={`font-semibold ${
                              order.paymentStatus === "paid"
                                ? "text-green-700"
                                : "text-yellow-700"
                            }`}
                          >
                            {typeof order.paymentStatus === "string"
                              ? order.paymentStatus.toUpperCase()
                              : "UNKNOWN"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:gap-3 sm:px-6 sm:py-5">
                    <NavLink to={`/products/${order._id}`} className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:text-sm"  >                   
                      View Details                    
                    </NavLink>
                    <button className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 sm:text-sm">
                      Track Order
                    </button>
                    {status !== "cancelled" && status !== "delivered" && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        className="flex-1 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 sm:text-sm"
                      >
                        Cancel Order
                      </button>
                    )}
                    {status === "delivered" && (
                      <button className="flex-1 rounded-xl border border-green-300 bg-green-50 px-4 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100 sm:text-sm">
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && orders.length > 0 && sortedAndFilteredOrders.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-12 text-center sm:py-16 md:rounded-3xl">
            <div className="mx-auto mb-4 text-4xl sm:text-5xl">🔍</div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl md:text-2xl">
              No orders found
            </h2>
            <p className="mt-2 text-xs text-slate-600 sm:text-sm md:text-base">
              Try adjusting your filters to find what you're looking for
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
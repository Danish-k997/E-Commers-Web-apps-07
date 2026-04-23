import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { createOrder, verifyPayment } from "../Servers/ProducteServer";
import Orderdetaile from "../Components/Orderdetaile.tsx";
import { toast } from "react-toastify";



const OrderSummery = () => {
  const context = useContext(ShopContext);
  const fetchAddress = context?.fetchAddress;
  const address = context?.address;
  const addressLoading = context?.addressLoading;
  const navigate = useNavigate();
  const selectedIds = context?.selectedItems ?? [];
  const allCartItems = context?.cartItems ?? [];
  const setCartItems = context?.setCartItems;
  const clearSelection = context?.clearSelection;
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
  const [isLoading, setIsLoading] = useState(false);

  const cartItems = allCartItems.filter((item) => {
    const id =
      typeof item.productId === "string"
        ? item.productId
        : (item.productId as any)._id;
    return selectedIds.includes(id);
  });

  useEffect(() => {
    fetchAddress?.();
  }, [fetchAddress]);

  const orderSubtotal = cartItems.reduce((sum, item) => {
    const product =
      typeof item.productId === "string" ? { price: 0 } : item.productId;
    const price = typeof product?.price === "number" ? product.price : 0;
    const quantity = typeof item.quantity === "number" ? item.quantity : 0;
    return sum + price * quantity;
  }, 0);

  const DELIVERY_FEE = 20;
  const orderTotal = orderSubtotal + DELIVERY_FEE;

  const handleCreateOrder = async () => {
    if (!address) {
      toast.error("Please add a delivery address before proceeding.");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Add items before checkout.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await createOrder({
        shippingAddress: {
          name: address.name,
          phone: address.phone,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          landmark: address.landmark,
        },
        paymentMethod: paymentMethod,
      });


      if (!response.data.paymentRequired) {
        setCartItems?.((prev) =>
          prev.filter((item) => {
            const id =
              typeof item.productId === "string"
                ? item.productId
                : (item.productId as any)._id;
            return !selectedIds.includes(id);
          }),
        );
        clearSelection?.();
        toast.success("Order created successfully!");
        navigate("/orders");
        return;
      }

      if (response.data.paymentRequired) {
        openRazorpay(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create order.");
    } finally {
      setIsLoading(false);
    }
  };

  const openRazorpay = async (data: {
    order: { _id: string };
    razorpayOrderId: string;
    amount: number;
    currency: string;
  }) => {
    const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!key) {
      toast.error("Razorpay key missing. Cannot proceed with payment.");
      console.error("Razorpay key not found");
      return;
    }
    const options = {
      key: key,

      amount: data.amount,

      currency: data.currency,

      name: "Sci-Fai Store",

      order_id: data.razorpayOrderId,

      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const verifyResponse = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            orderId: data.order._id,
          }); 

          if (!verifyResponse.data.success) {
            toast.error("Payment verification failed");
          }
            
          setCartItems?.((prev) =>
            prev.filter((item) => {
              const id =
                typeof item.productId === "string"
                  ? item.productId
                  : (item.productId as any)._id;
              return !selectedIds.includes(id);
            }),
          );
          clearSelection?.();
          toast.success("Payment successful!");
          navigate("/orders");
        } catch (error) {
          toast.error("Payment verification failed");
          console.error(error);
        }
      },

      modal: {
        ondismiss: () => {
          toast.error("Payment cancelled");
        },
      },

      prefill: {
        name: address?.name,
        contact: address?.phone,
      },

      theme: {
        color: "#f97316",
      },
    };

    const razorpayInstance = new (window as any).Razorpay(options);
    razorpayInstance.open();
  };

  const handleEditAddress = () => {
    if (address) {
      navigate("/update-address", { state: { address } });
    } else {
      navigate("/address");
    }
  };

  return (
    <section className="min-h-screen bg-slate-100 px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-8 sm:p-6 md:rounded-3xl">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 sm:text-sm">
              Order summary
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl md:text-4xl">
              Review your order
            </h1>
            <p className="mt-2 text-xs text-slate-600 sm:mt-3 sm:text-sm">
              Confirm your selected products and shipping information before you
              pay.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-[1.75fr_0.95fr]">
          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:rounded-3xl">
              <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500 sm:text-sm">
                    Shipping address
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900 sm:mt-2 sm:text-xl md:text-2xl">
                    Delivery details
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleEditAddress}
                  className="inline-flex items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-600 sm:px-5 sm:py-3 sm:text-sm"
                >
                  Edit address
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:mt-6 sm:gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-700 sm:rounded-3xl sm:p-5 sm:text-sm">
                  {addressLoading ? (
                    <p>Loading address...</p>
                  ) : address ? (
                    <>
                      <p className="font-semibold text-slate-900">
                        {address.name}
                      </p>
                      <p>{address.phone}</p>
                      {address.landmark && <p>Landmark: {address.landmark}</p>}
                      <p>
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p>{address.country}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-slate-900">
                        No delivery address
                      </p>
                      <p className="mt-2 text-slate-600">
                        Add an address to complete checkout.
                      </p>
                    </>
                  )}
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-700 sm:rounded-3xl sm:p-5 sm:text-sm">
                  <p className="font-semibold text-slate-900">Order details</p>
                  <p className="mt-2 sm:mt-3">
                    Review items, quantity, and totals before payment.
                  </p>
                </div>
              </div>
            </div>

            <Orderdetaile cartItems={cartItems} />
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6 md:rounded-3xl md:p-7">
            <div className="mb-4 sm:mb-6">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 sm:text-sm">
                Payment summary
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 sm:mt-3 sm:text-2xl md:text-3xl">
                Total amount
              </h2>
            </div>

            <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm sm:space-y-4 sm:p-6 md:rounded-3xl">
              <div className="flex items-center justify-between text-xs text-slate-600 sm:text-sm">
                <span>Items total</span>
                <span>₹{orderSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 sm:text-sm">
                <span>Delivery fee</span>
                <span>₹{DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 text-sm font-semibold text-slate-900 sm:pt-4 sm:text-base">
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span>₹{orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-orange-50 p-3 text-xs text-slate-700 sm:p-4 sm:text-sm md:rounded-3xl">
                <p className="font-semibold text-slate-900">
                  Choose payment method
                </p>
                <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                  <label
                    className={`block cursor-pointer rounded-2xl border px-3 py-3 transition sm:px-4 sm:py-4 md:rounded-3xl ${paymentMethod === "cod" ? "border-orange-500 bg-orange-100" : "border-slate-200 bg-white hover:border-orange-300"}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="sr-only"
                    />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          Cash on Delivery
                        </p>
                        <p className="text-xs text-slate-500 sm:text-xs">
                          Pay when your order arrives.
                        </p>
                      </div>
                      <span className="w-fit rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase text-slate-700 sm:px-3">
                        COD
                      </span>
                    </div>
                  </label>
                  <label
                    className={`block cursor-pointer rounded-2xl border px-3 py-3 transition sm:px-4 sm:py-4 md:rounded-3xl ${paymentMethod === "razorpay" ? "border-orange-500 bg-orange-100" : "border-slate-200 bg-white hover:border-orange-300"}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="sr-only"
                    />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">Razorpay</p>
                        <p className="text-xs text-slate-500">
                          Fast checkout with Razorpay.
                        </p>
                      </div>
                      <span className="w-fit rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase text-slate-700 sm:px-3">
                        RZ
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreateOrder}
                disabled={isLoading}
                className="mt-4 w-full rounded-2xl bg-orange-500 px-4 py-3 text-xs font-semibold text-white transition hover:bg-orange-600 sm:mt-6 sm:px-6 sm:py-4 sm:text-sm md:rounded-3xl"
              >
                {isLoading ? "Processing..." : "Proceed to payment"}
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 sm:mt-6 sm:p-5 sm:text-sm md:rounded-3xl">
              <p className="font-semibold text-slate-900">Secure checkout</p>
              <p className="mt-2">
                Use our secure payment gateway to complete your order quickly
                and safely.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default OrderSummery;

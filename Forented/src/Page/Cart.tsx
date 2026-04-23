import { useContext, useMemo, useCallback } from "react";
import { removeFromCart } from "../Servers/ProducteServer.ts";

import { ShopContext } from "../Context/ShopContext.tsx";
import { Link, useNavigate } from "react-router";
 
type CartItem = {
  productId: Record<string, unknown> | string;
  quantity: number;
};
 
const DELIVERY_FEE = 20;  
 
const getProductId = (productId: CartItem["productId"]): string => {
  return typeof productId === "string"
    ? productId
    : ((productId as Record<string, unknown>)._id as string) ?? "";
};
 
const Cart = () => {
  const shopContext = useContext(ShopContext);
  const user = shopContext?.user as { id?: string } | null;
 
  const setCartItems = shopContext?.setCartItems;
  const navigate = useNavigate();

 const cartItems = useMemo(
  () => shopContext?.cartItems || [],
  [shopContext?.cartItems]
)

const selectedItems = useMemo(
  () => shopContext?.selectedItems ?? [],
  [shopContext?.selectedItems]
)
  const toggleItemSelection = shopContext?.toggleItemSelection;
  const selectAllItems      = shopContext?.selectAllItems;
  const clearSelection      = shopContext?.clearSelection;
 
  const userId = user?.id;
 
  const handleRemove = useCallback(async (productId: string) => {
    if (!userId) return;
    try {
      await removeFromCart(userId, productId);
      setCartItems?.((prev) =>
        prev.filter((item) => getProductId(item.productId) !== productId),
      );
      // ✅ Agar removed item selected tha toh selection se bhi hatao
      if (selectedItems.includes(productId)) {
        toggleItemSelection?.(productId);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  }, [userId, setCartItems, selectedItems, toggleItemSelection]);
 
 
  const handleOrderThis = useCallback((productId: string) => {
    clearSelection?.();           // pehle purana selection saaf karo
    toggleItemSelection?.(productId); // sirf yeh ek item select karo
    navigate("/order-summary");   // ab order summary pe jao — NO STATE
  }, [clearSelection, toggleItemSelection, navigate]);
 
  
  const handleOrderSelected = useCallback(() => {
    if (selectedItems.length === 0) return;
    navigate("/order-summary");   // Context mein selectedItems pehle se hai
  }, [selectedItems, navigate]);
 
  // ✅ FIX 8: Select All toggle — saare selected hain toh clear, warna select all
  const handleSelectAll = useCallback(() => {
    const allSelected =
      cartItems.length > 0 &&
      cartItems.every((item) =>
        selectedItems.includes(getProductId(item.productId)),
      );
    allSelected ? clearSelection?.() : selectAllItems?.();
  }, [cartItems, selectedItems, clearSelection, selectAllItems]);
 
  // ✅ FIX 9: Sidebar mein SELECTED items ka total dikhao, na poori cart ka
  // Pehle: subtotal = poori cart ka total (misleading tha)
  // Ab: agar kuch selected hai → selected ka total, warna poori cart ka total
  const selectedCartItems = useMemo(
    () => cartItems.filter((item) => selectedItems.includes(getProductId(item.productId))),
    [cartItems, selectedItems],
  );
 
  const subtotal = useMemo(() => {
    const itemsToCount = selectedCartItems.length > 0 ? selectedCartItems : cartItems;
    return itemsToCount.reduce((sum, item: CartItem) => {
      const product =
        typeof item?.productId === "string"
          ? { price: 0 }
          : (item?.productId as Record<string, unknown>);
      const price = typeof product?.price === "number" ? product.price : 0;
      const quantity = typeof item?.quantity === "number" ? item.quantity : 0;
      return sum + price * quantity;
    }, 0);
  }, [selectedCartItems, cartItems]);
 
  const total = subtotal + DELIVERY_FEE;
 
  // Derived values
  const allSelected =
    cartItems.length > 0 &&
    cartItems.every((item) =>
      selectedItems.includes(getProductId(item.productId)),
    );
  const hasSelection = selectedItems.length > 0;
 
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
 
      {/* ✅ FIX 10: Header — Select All + Order Selected buttons */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Shopping Cart
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Review your order
          </h1>
        </div>
 
        <div className="flex flex-wrap items-center gap-3">
          {/* ✅ FIX 11: Link ke andar button NAHI — Link ko hi style dena chahiye */}
          <Link
            to="/categories"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Continue shopping
          </Link>
 
          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={handleOrderSelected}
              disabled={!hasSelection}
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {hasSelection
                ? `Order Selected (${selectedItems.length})`
                : "Select items to order"}
            </button>
          )}
        </div>
      </div>
 
      {cartItems.length === 0 ? (
        // Empty state
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
          <div className="mb-4 text-5xl">🛒</div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Your cart is empty
          </h2>
          <p className="mt-3 text-slate-600">
            Browse products and add them to your cart to begin checkout.
          </p>
          <Link
            to="/categories"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.65fr_0.95fr]">
 
          {/* Left: Items list */}
          <section className="space-y-4">
 
            {/* ✅ FIX 12: Select All bar — items list ke upar */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3">
              <label className="flex cursor-pointer items-center gap-3 select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="h-4 w-4 cursor-pointer accent-orange-500"
                />
                <span className="text-sm font-semibold text-slate-700">
                  {allSelected ? "Deselect All" : "Select All"}
                </span>
              </label>
              {hasSelection && (
                <span className="ml-auto text-xs text-slate-500">
                  {selectedItems.length} of {cartItems.length} selected
                </span>
              )}
            </div>
 
            {cartItems.map((item: CartItem) => {
              const product =
                typeof item?.productId === "string"
                  ? {
                      _id: item.productId,
                      name: "Unknown product",
                      price: 0,
                      images: [] as string[],
                      description: "Product information is not available.",
                      category: "Product",
                    }
                  : (item?.productId as Record<string, unknown>);
 
              const productId    = getProductId(item.productId); // ✅ helper use
              const productImage = (product?.images as string[])?.[0] ?? "";
              const itemPrice    = typeof product?.price === "number" ? product.price : 0;
              const itemQuantity = typeof item?.quantity === "number" ? item.quantity : 0;
              const itemSubtotal = (itemPrice * itemQuantity).toFixed(2);
              const isSelected   = selectedItems.includes(productId); // ✅ checked state
 
              return (
                <article
                  key={productId || "unknown"}
                  // ✅ FIX 13: Selected item ko visual highlight — UX improvement
                  className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md ${
                    isSelected ? "border-orange-400 ring-1 ring-orange-300" : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-start">
 
                    {/* ✅ FIX 14: Checkbox + Image side by side */}
                    <div className="flex items-start gap-3 lg:flex-col lg:items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItemSelection?.(productId)}
                        className="mt-1 h-4 w-4 cursor-pointer accent-orange-500 lg:mt-0"
                      />
                      <img
                        src={productImage}
                        alt={typeof product?.name === "string" ? product.name : "Product"}
                        className="h-40 w-full rounded-2xl object-cover object-center lg:h-36 lg:w-36"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/placeholder.png";
                        }}
                      />
                    </div>
 
                    <div className="flex flex-1 flex-col gap-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.25em] text-orange-500">
                            {typeof product?.category === "string" ? product.category : "Featured"}
                          </p>
                          <h2 className="mt-1 text-xl font-semibold text-slate-900">
                            {typeof product?.name === "string" ? product.name : "Unnamed"}
                          </h2>
                        </div>
                        <span className="w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                          ₹{itemPrice.toFixed(2)}
                        </span>
                      </div>
 
                      <p className="text-sm leading-6 text-slate-500">
                        {typeof product?.description === "string"
                          ? product.description
                          : "No description"}
                      </p>
 
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                          Qty: <span className="font-semibold text-slate-900">{itemQuantity}</span>
                        </div>
                        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                          Total: <span className="font-semibold text-slate-900">₹{itemSubtotal}</span>
                        </div>
                        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                          SKU:{" "}
                          <span className="font-semibold text-slate-900">
                            {productId.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                      </div>
 
                      {/* ✅ FIX 15: Buttons — Remove, Save for later, Order This */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleRemove(productId)}
                          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                        >
                          Save for later
                        </button>
                        {/* ✅ FIX 16: "Order This" — sirf is ek item ka order */}
                        <button
                          type="button"
                          onClick={() => handleOrderThis(productId)}
                          className="rounded-full border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100"
                        >
                          Order This
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
 
          {/* Right: Order Summary sidebar */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-slate-50 p-7 shadow-sm">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Order summary
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                Payment details
              </h2>
            </div>
 
            <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm">
              {/* ✅ FIX 17: Selected items count dikhao sidebar mein */}
              {hasSelection && (
                <div className="rounded-2xl bg-orange-50 px-4 py-2 text-xs text-orange-700">
                  {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{hasSelection ? "Selected items" : "All items"}</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Delivery fee</span>
                <span>₹{DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
 
            <button
              type="button"
              onClick={handleOrderSelected}
              disabled={!hasSelection}
              className="mt-6 w-full rounded-3xl bg-orange-500 px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {hasSelection
                ? `Order Selected (${selectedItems.length})`
                : "Select items to order"}
            </button>
 
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Select the items you want to order. Use "Order This" to quickly order a single item.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
};
 
export default Cart;


import React from "react";

type CartItem = {
  productId: Record<string, unknown> | string;
  quantity: number;
};

interface OrderdetaileProps {
  cartItems: CartItem[];
}

const Orderdetaile: React.FC<OrderdetaileProps> = ({ cartItems }) => {
  const items = cartItems || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Order details</h2>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
          Your order has no items yet.
        </div>
      ) : (
        items.map((item, index) => {
          const product =
            typeof item.productId === "string"
              ? {
                  _id: item.productId,
                  name: "Unknown product",
                  price: 0,
                  images: [] as string[],
                  description: "Product information is not available.",
                  category: "Product",
                }
              : (item.productId as Record<string, unknown>);

          const productId =
            typeof item.productId === "string"
              ? item.productId
              : String(product._id || product.id || `item-${index}`);
          const productName =
            typeof product.name === "string" ? product.name : "Unnamed product";
          const productCategory =
            typeof product.category === "string" ? product.category : "Product";
          const productDescription =
            typeof product.description === "string"
              ? product.description
              : "No description available.";
          const imageUrl =
            Array.isArray(product.images) && product.images.length > 0
              ? String(product.images[0])
              : "https://via.placeholder.com/180";
          const price = typeof product.price === "number" ? product.price : 0;
          const quantity = typeof item.quantity === "number" ? item.quantity : 0;
          const subtotal = (price * quantity).toFixed(2);

          return (
            <div
              key={productId}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center">
                <img
                  src={imageUrl}
                  alt={productName}
                  className="h-36 w-full rounded-3xl object-cover object-center md:h-32 md:w-32"
                />

                <div className="flex-1 space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-orange-500">{productCategory}</p>
                      <h3 className="text-xl font-semibold text-slate-900">{productName}</h3>
                    </div>
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                      ₹{price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-slate-600">{productDescription}</p>

                  <div className="grid grid-cols-2 gap-3 text-sm text-slate-700 sm:grid-cols-3">
                    <div className="rounded-3xl bg-slate-50 px-4 py-3">
                      Quantity
                      <p className="mt-1 font-semibold text-slate-900">{quantity}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-4 py-3">
                      Subtotal
                      <p className="mt-1 font-semibold text-slate-900">₹{subtotal}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 px-4 py-3">
                      SKU
                      <p className="mt-1 font-semibold text-slate-900">{productId.toString().slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Orderdetaile;
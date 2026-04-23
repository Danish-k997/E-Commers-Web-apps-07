import {  useParams} from "react-router-dom";
import { useEffect, useState,useContext } from "react";
import { getProducts } from "../Servers/ProducteServer.ts";
import type { ProductType } from "../Types/ProductsType.ts";
import RelatedProducts from "../Components/RelatedProducts.tsx";
import { addtoCart } from "../Servers/ProducteServer.ts";
import { toast } from "react-toastify";
import { ShopContext } from "../Context/ShopContext.tsx";

  
const AddToCart = () => {

  const { id } = useParams();
  const [product, setProduct] = useState<ProductType[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const  contex  = useContext(ShopContext);
  const user = contex?.user;
  const userId = user?.id;
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProduct(response.data.products);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);   
  
 

  const productData = product.find((productItem) => productItem._id === id); 

  const handeladdToCart = () => { 
    if (!productData) return;
    if (!userId) {
      toast.error("Please login to add items to your cart.");
      return;
    }
    if (selectedSize === "") {
      toast.error("Please select a size before adding to cart.");
      return;
    }
    addtoCart(userId, productData._id, quantity)
      .then((response) => {
        console.log("Product added to cart:", response.data); 
        toast.success("Product added to cart successfully!")
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  }

  const rawSizes: string[] | undefined = productData?.sizes ?? productData?.size;
  const availableSizes = Array.isArray(rawSizes)
    ? rawSizes.flatMap((item) =>
        typeof item === "string"
          ? item
              .split(/\s+/)
              .map((value) => value.trim())
              .filter(Boolean)
          : [],
      )
    : [];

  if (!productData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center text-base text-gray-600">
          Loading product details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-orange-600 transition-colors">Home</a></li>
            <li className="text-gray-400">/</li>
            <li><a href="/categories" className="hover:text-orange-600 transition-colors">Categories</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{productData.name}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 items-start">

          {/* Product Images */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-lg">
              <img
                src={
                  productData.images[selectedImageIndex] ?? productData.images[0]
                }
                alt={productData.name}
                className="w-full h-96 sm:h-[500px] lg:h-[600px] object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {productData.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                    selectedImageIndex === index
                      ? "border-orange-500 ring-2 ring-orange-200 scale-105"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productData.name} ${index + 1}`}
                    className="w-full h-20 sm:h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">

            {/* Product Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  {productData.category}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                  {productData.subCategory}
                </span>
                {productData.bestseller && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Bestseller
                  </span>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {productData.name}
              </h1>
              <p className="text-3xl lg:text-4xl font-bold text-orange-600">
                ${productData.price.toFixed(2)}
              </p>
            </div>

            {/* Purchase Options */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-lg">

              {/* Size Selection */}
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-600">
                  Choose size
                </p>
                {availableSizes.length > 0 ? (
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="">Select a size</option>
                    {availableSizes.map((size: string) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-xl">
                    Size options are not available for this product.
                  </p>
                )}
              </div>

              {/* Quantity Selection */}
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-600">
                  Quantity
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-xl">
                    <button
                      onClick={decreaseQuantity}
                      className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors rounded-l-xl"
                    >
                      −
                    </button>
                    <span className="px-4 py-3 text-center min-w-[50px] font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      className="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors rounded-r-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-600">
                  Product details
                </p>
                <p className="text-sm leading-relaxed text-gray-700">
                  {productData.description}
                </p>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button" 
                onClick={handeladdToCart}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-4 text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Add to Cart
              </button>
            
              
            
            </div>

            {/* Selection Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-600 mb-4">
                Current selection
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Size</span>
                  <span className="font-medium text-gray-900">
                    {selectedSize || "Not selected"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium text-gray-900">{quantity}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-lg text-orange-600">
                    ${(productData.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts products={product} category={productData.category} currentId={productData._id} />
        </div>

      </div>
    </div>
  );
};

export default AddToCart;

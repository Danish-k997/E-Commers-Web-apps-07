import { useState,useEffect} from "react";
import ProductsCart from "./ProductsCart";
import type { ProductType } from "../Types/ProductsType.ts"
import Title from "./Title.tsx";
import { bestSellerProducts } from "../Servers/ProducteServer.ts";

const BestSeller = () => {
  const [bestSeller, setBestSeller] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await bestSellerProducts();
        setBestSeller(response.data.data);

      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  },[])

  return (
    <div className="py-8">
      <Title
        title="Best Seller Products"
        subtitle="Most popular items"
        accentColor="#F97316"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
        {bestSeller.map((product,i) => (
          <ProductsCart key={i}
           {...product}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
          View All Bestsellers →
        </button>
      </div>
    </div>
  );
};

export default BestSeller;

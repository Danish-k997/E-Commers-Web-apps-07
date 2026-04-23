import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import ProductsCart from "../Components/ProductsCart";
import type { ProductType } from "../Types/ProductsType";
import Filter from "../Components/Filter";
import SummerSaleBanner from "../Components/SummerSale";
import Footer from "../Components/Footer";
import { getProducts } from "../Servers/ProducteServer";
const Categories = () => {
  const context = useContext(ShopContext);

  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data.products);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { selectedCategory, selectedPrice, selectedSort } = context;

  let filteredProducts = [...products];

  // Category filter
  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(
      (item) => item.category === selectedCategory.toLocaleLowerCase(),
    );
  }

  // Price filter
  if (selectedPrice) {
    const [min, max] = selectedPrice.split("-").map(Number);

    filteredProducts = filteredProducts.filter(
      (item) => item.price >= min && item.price <= max,
    );
  }

  // Sorting
  if (selectedSort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div>
      <div className="filter">
        <Filter />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-5 mx-10">
        {filteredProducts.map((product: ProductType) => (
          <ProductsCart key={product._id} {...product} />
        ))}
      </div>

      <SummerSaleBanner />

      <Footer />
    </div>
  );
};

export default Categories;

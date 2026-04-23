import Title from "./Title";
import { useContext, useMemo } from "react";
import { ShopContext } from "../Context/ShopContext";
import type { ProductType } from "../Types/ProductsType";
import ProductsCart from "./ProductsCart";

const Shopbycategorie = () => {

  const context = useContext(ShopContext);
  if (!context) return null;

  const { products, category, setCategory } = context;

  const filteredProducts = useMemo(() => {

    if (category === "all") return products;

    return products.filter(
      (product) => product.category === category
    );

  }, [products, category]);

  return (
    <div>
      <Title title="Shop by Category" subtitle="" accentColor="#10B981" />

      {/* CATEGORY BUTTONS 🔥 */}
      <div className="flex gap-4 mb-4">
        <button onClick={() => setCategory("all")}>All</button>
        <button onClick={() => setCategory("men")}>Men</button>
        <button onClick={() => setCategory("women")}>Women</button>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product: ProductType) => (
          <ProductsCart key={product._id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default Shopbycategorie;
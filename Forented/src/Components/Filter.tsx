import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";

const Filter = () => {
  const context = useContext(ShopContext);
  if (!context) return null;

  const { setSelectedCategory, setSelectedPrice, setSelectedSort } = context;

  return (
    <aside className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50">
      <h2 className="mb-4 text-center text-2xl font-bold text-slate-800">Shop Our Collection</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-semibold text-slate-600">
            Categories
          </label>
          <select
            id="category"
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          >
            <option value="all">All</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Shoes">Shoes</option>
            <option value="Kids">Kids</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="block text-sm font-semibold text-slate-600">
            Price range
          </label>
          <select
            id="price"
            onChange={(e) => setSelectedPrice(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          >
            <option value="200-500">₹200 - ₹500</option>
            <option value="500-1000">₹500 - ₹1,000</option>
            <option value="1000-2000">₹1,000 - ₹2,000</option>
            <option value="2000-5000">₹2,000 - ₹3,000</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="sort" className="block text-sm font-semibold text-slate-600">
            Sort by
          </label>
          <select
            id="sort"
            onChange={(e) => setSelectedSort(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">None</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>
    </aside>
  );
};

export default Filter;

import { MdAdd} from "react-icons/md";
import { NavLink } from "react-router";
import ProductsList from "../Components/ProductsList";


const Products = () => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Products List</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your product inventory</p>
        </div>

        <NavLink
          to="/addproducts"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <MdAdd className="text-2xl" />
          <span>Add Product</span>
        </NavLink>
      </div>

     <ProductsList/>
    </div>
  );
};

export default Products;
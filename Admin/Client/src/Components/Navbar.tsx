import { IoNotifications } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { SiSearxng } from "react-icons/si";
import { useContext } from "react";
import { AdminContext } from "../Context/AdminContext";

const Navbar = () => {
  const context = useContext(AdminContext);
  const orders = context.Orders;

  return (
    <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-black">
            A
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">AdminPanel</p>
            <p className="text-xs text-slate-500">Dashboard</p>
          </div>
        </div>

        {/* Middle: Search */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 shadow-sm">
          <SiSearxng className="text-slate-400 text-xl" />
          <input
            type="search"
            placeholder="Search products, users, orders..."
            className="h-10 w-72 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Right: notifications + profile */}
        <div className="flex items-center gap-3">
          <button className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            <IoNotifications className="text-2xl" />
            <span className="absolute -right-1 -top-1 h-4 min-w-[1rem] rounded-full bg-red-500 px-1 text-xs text-white">
              {orders.length}
            </span>
          </button>

          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 hover:shadow-sm">
            <CgProfile className="text-2xl text-slate-700" />
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900">Admin</p>
              <p className="text-xs text-slate-500">Manage</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

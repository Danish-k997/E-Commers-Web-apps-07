import { useEffect, useContext } from "react";
import { AdminContext } from "../Context/AdminContext";

const Dashbord = () => {
  const context = useContext(AdminContext);
  const ShowOrders = context.ShowOrders;
  const Orders = context.Orders;
  const products = context.products;
  const bestseller = products.filter((product) => product.bestseller);
  const fetchUser = context.fetchUser;
  const alluser = context.alluser;

  useEffect(() => {
    fetchUser();
    ShowOrders();
  }, [fetchUser, ShowOrders]);

  const stats = [
    {
      title: "Total Orders",
      value: Orders.length,
      tone: "from-amber-200 to-orange-200",
      bar: "bg-cyan-500",
      icon: "O",
    },
    {
      title: "Total Products",
      value: products.length,
      tone: "from-sky-200 to-blue-200",
      bar: "bg-orange-500",
      icon: "P",
    },
    {
      title: "Total BestSeller",
      value: bestseller.length,
      tone: "from-lime-200 to-emerald-200",
      bar: "bg-pink-500",
      icon: "B",
    },
    {
      title: "Total Users",
      value: alluser?.length || 0,
      tone: "from-rose-200 to-fuchsia-200",
      bar: "bg-indigo-500",
      icon: "U",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-140px)] rounded-2xl border-2 border-slate-200 bg-[#ece6d8] p-4 shadow-[10px_10px_0px_#1f2937] md:p-6">
      <div className="mb-5 rounded-lg border-2 border-slate-800 bg-[#f8f3e9] p-3 shadow-[4px_4px_0px_#0f172a]">
        <div className="mb-2 flex items-center justify-between border border-slate-900 bg-cyan-500 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-900">
          <span>Dashboard Control Panel</span>
          <span>x</span>
        </div>
        <p className="text-sm font-medium text-slate-700">
          Classic UI look + modern admin layout
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={`relative overflow-hidden rounded-md border-2 border-slate-900 bg-gradient-to-br ${stat.tone} p-0 shadow-[8px_8px_0px_#111827] transition-transform duration-150 hover:-translate-y-1`}
          >
            <div className={`h-2 w-full ${stat.bar}`} />
            <div className="border-y-2 border-slate-900 bg-[#fffdf8] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-700">
              System Widget
            </div>

            <div className="flex h-40 items-center justify-between px-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                  {stat.title}
                </p>
                <p className="mt-3 text-4xl font-black text-slate-800">
                  {stat.value}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-sm border-2 border-slate-900 bg-[#ffd86f] text-xl font-black text-slate-800 shadow-[4px_4px_0px_#1f2937]">
                {stat.icon}
              </div>
            </div>

            <div className="absolute bottom-3 right-3 flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full border border-slate-900 bg-emerald-400" />
              <span className="h-2.5 w-2.5 rounded-full border border-slate-900 bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full border border-slate-900 bg-rose-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashbord;

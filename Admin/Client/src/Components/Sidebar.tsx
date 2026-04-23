import { useState } from "react"
import { NavLink } from "react-router-dom"
import {
  MdDashboard,
  MdShoppingCart,
  MdPeople,
  MdInventory2,
  MdMenu,
  MdClose,
} from "react-icons/md"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <MdDashboard /> },
    { name: "Products", path: "/products", icon: <MdInventory2 /> },
    { name: "Orders", path: "/orders", icon: <MdShoppingCart /> },
    { name: "Users", path: "/users", icon: <MdPeople /> },
   
  ]

  return (
    <>
      {/* 🔥 Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-slate-800 p-2 rounded-lg text-white"
        onClick={() => setIsOpen(true)}
      >
        <MdMenu size={24} />
      </button>

      {/* 🔥 Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* 🔥 Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-slate-800 border-r border-slate-700 flex flex-col transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* ❌ Close Button (Mobile) */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <MdClose size={24} className="text-white" />
          </button>
        </div>

        {/* 🧠 Logo Section */}
        <div className="flex items-center gap-3 border-b border-slate-700 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-lg">
            A
          </div>
          <p className="text-lg font-bold text-white">AdminPanel</p>
        </div>

        {/* 📌 Menu */}
        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)} // mobile pe click → close
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Sidebar
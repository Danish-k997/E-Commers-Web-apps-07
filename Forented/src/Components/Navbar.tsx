import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../assets/Image/logo.png"
import { FaSearch } from "react-icons/fa"
import { FaShoppingCart } from "react-icons/fa"
import { FaBars } from "react-icons/fa"
import { FaTimes } from "react-icons/fa"
import { NavLink } from "react-router-dom"
import { logoutUser } from "../Servers/ProducteServer.ts"
import { ShopContext } from "../Context/ShopContext"

const Navbar = () => {
  const context = useContext(ShopContext);
  const user = context?.user ?? null;
  const cartItems = context?.cartItems ?? [];
  const setUser = context?.setUser;
  const setIsGuest = context?.setIsGuest;
  const navigate = useNavigate(); 
  

  const [menuOpen, setMenuOpen] = useState(false)
  
  const handellogout = () => {
    logoutUser()
      .then(() => {
        console.log("Logout successful");
        setUser?.(null);
        setIsGuest?.(false);
        navigate("/login");
      })
      .catch(error => {
        console.error("Logout failed:", error);
      });
  }

  return (

    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full border-2 border-orange-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Sci-Fai Store</h1>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <NavLink to="/" className={({ isActive }) => isActive ? "text-orange-400 border-b-2 border-orange-400 pb-1 transition-all duration-300" : "hover:text-orange-300 transition-colors duration-200"}>
              Home
            </NavLink>
            <NavLink to="/categories"  className={({ isActive }) => isActive ? "text-orange-400 border-b-2 border-orange-400 pb-1 transition-all duration-300" : "hover:text-orange-300 transition-colors duration-200"}>
              Categories
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => isActive ? "text-orange-400 border-b-2 border-orange-400 pb-1 transition-all duration-300" : "hover:text-orange-300 transition-colors duration-200"}>
              My Orders
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "text-orange-400 border-b-2 border-orange-400 pb-1 transition-all duration-300" : "hover:text-orange-300 transition-colors duration-200"}>
              Profile
            </NavLink>
            {user?.role === "admin" && (<a href="https://si-fi-store-admin-07-git-main-danish-khans-projects-32cebd46.vercel.app" target="_blank" rel="noreferrer" className="hover:text-orange-300 transition-colors duration-200">
              Admin Panel
            </a>)}
          </ul>


          {/* Desktop Icons */}
          <div className="hidden lg:flex items-center gap-6">
            <button className="p-2 hover:bg-slate-700 rounded-full transition-colors duration-200">
              <FaSearch className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-slate-700 rounded-full transition-colors duration-200 relative">
              <Link to="/cart">
              <FaShoppingCart   className="w-5 h-5" />             
              </Link>
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItems?.length || 0}</span>
            </button>

            <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105">
             {user ? <span onClick={handellogout}>Logout</span> : <NavLink to="/login">Login</NavLink>}
            </button>
          </div>


          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (

        <div className="lg:hidden bg-slate-800 border-t border-slate-700">

          <div className="px-4 py-6 space-y-4">

            <div className="flex flex-col gap-4">
              <NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? "text-orange-400 font-medium" : "text-white hover:text-orange-300 transition-colors duration-200"}>
                Home
              </NavLink>
              <NavLink to="/categories" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? "text-orange-400 font-medium" : "text-white hover:text-orange-300 transition-colors duration-200"}>
                Categories
              </NavLink>
              <NavLink to="/abouts" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? "text-orange-400 font-medium" : "text-white hover:text-orange-300 transition-colors duration-200"}>
                About
              </NavLink>
              <NavLink to="/contacts" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? "text-orange-400 font-medium" : "text-white hover:text-orange-300 transition-colors duration-200"}>
                Contact
              </NavLink>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-700">
              <button className="p-3 hover:bg-slate-700 rounded-full transition-colors duration-200">
                <FaSearch className="w-5 h-5" />
              </button>
              <button className="p-3 hover:bg-slate-700 rounded-full transition-colors duration-200 relative">
                <FaShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105">
             {user ? <span onClick={handellogout}>Logout</span> : <NavLink to="/login">Login</NavLink>}
            </button>
            </div>

          </div>

        </div>

      )}

    </nav>
  )
}

export default Navbar
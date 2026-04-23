import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./Components/Navbar"
import Sidebar from "./Components/Sidebar"
import Dashbord from "./Page/Dashbord"
import Products from "./Page/Products"
import AddProducts from "./Page/AddProducts"
import Orders from "./Page/Orders"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide} from "react-toastify";
import AdminRouter from "./Components/AdminRouter.tsx";
import User from "./Page/User.tsx"

function App() {
  return (
    <BrowserRouter>
    <ToastContainer transition={Slide} />
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={
                <AdminRouter>
                  <Dashbord />
                </AdminRouter>
                } />
              <Route path="/products" element={
                <AdminRouter>
                  <Products />
                </AdminRouter>
              } />
              <Route path="/orders" element={
                <AdminRouter>
                  <Orders />
                </AdminRouter>
              } />
              <Route path="/addproducts" element={
                <AdminRouter>
                  <AddProducts />
                </AdminRouter>
              } />
              <Route path="/users" element={
                <AdminRouter>
                 <User/>
                </AdminRouter>
              } />
             
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App

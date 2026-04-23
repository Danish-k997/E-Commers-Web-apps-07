import Navbar from "./Components/Navbar.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Page/Home.tsx";
import Categories from "./Page/Categories.tsx";
import Auth from "./Page/Auth.tsx";
import ForgotPassword from "./Page/ForgotPassword.tsx";
import ResetPassword from "./Page/ResetPassword.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Components/Login.tsx";
import ProtectedRoute from "./Components/ProtectedRouter.tsx";
import ShowProducts from "./Page/ShowProducts.tsx";
import Cart from "./Page/Cart.tsx";
import AddAddress from "./Page/AddAddress.tsx";
import OrderSummery from "./Page/OrderSummery.tsx";
import UpdateAddress from "./Page/UpdateAddress.tsx";
import MyOrders from "./Page/MyOrders.tsx";
import Profile from "./Page/Profile.tsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ShowProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
           
              <Auth />
          
          }
        />
        <Route
          path="/login"
          element={
           
              <Login />
           
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/address"
          element={
            <ProtectedRoute>
              <AddAddress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-summary"
          element={
            <ProtectedRoute>
              <OrderSummery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-address"
          element={
            <ProtectedRoute>
              <UpdateAddress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

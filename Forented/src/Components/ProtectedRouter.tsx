import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import type { ReactNode } from "react"; 


                                                                         
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const context = useContext(ShopContext);

  if (!context) {
    return <Navigate to="/login" replace />;
  }

  const { user, isGuest, loading } = context;

  if (loading) return <h1>Loading...</h1>;

  if (!user && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
import  type { ReactNode } from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../Context/AdminContext";

interface ProtectedRouterProps {
  children: ReactNode;
}

const AdminRouter = ({ children }: ProtectedRouterProps) => {
  const { user, loading } = useContext(AdminContext);

  if (loading) return <h1>Loading...</h1>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRouter
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { createContext, useState, useEffect, useCallback } from "react";
import { checkUser } from "../Utlis/CheckUser";
import type { ProductType } from "../Types/ProductsType";
import { getOrders, getProducts, getalluser } from "../Server/AdminServer";

export type AdminUser = null | {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
};

interface AdminContextValue {
  user: AdminUser;
  setUser: Dispatch<SetStateAction<AdminUser>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  isGuest: boolean;
  setIsGuest: Dispatch<SetStateAction<boolean>>;
  products: ProductType[];
  setProducts: Dispatch<SetStateAction<ProductType[]>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  productsloading: boolean;
  setProductsloading: Dispatch<SetStateAction<boolean>>;
  ShowOrders: () => Promise<void>;
  Orders: ProductType[];
  setOrders: Dispatch<SetStateAction<ProductType[]>>;
  fetchUser: () => Promise<void>;
  alluser: AdminUser[];
  setalluser: Dispatch<SetStateAction<AdminUser[]>>;
}

interface AdminProviderProps {
  children: ReactNode;
}

const defaultAdminContextValue: AdminContextValue = {
  user: null,
  setUser: () => undefined,
  loading: true,
  setLoading: () => undefined,
  isGuest: false,
  setIsGuest: () => undefined,
  products: [],
  setProducts: () => undefined,
  error: null,
  setError: () => undefined,
  ShowOrders: async () => {},
  productsloading: true,
  setProductsloading: () => undefined,
  Orders: [],
  setOrders: () => undefined,
  fetchUser: async () => {},
  alluser:[],
  setalluser: () => undefined,

};

const AdminContext = createContext<AdminContextValue>(defaultAdminContextValue);

const AdminProvider = ({ children }: AdminProviderProps) => {
  const [user, setUser] = useState<AdminUser>(null);
  const [loading, setLoading] = useState(true);
  const [productsloading, setProductsloading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [Orders, setOrders] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [alluser,setalluser] = useState<AdminUser[]>([]);


  useEffect(() => {
    const fetchUser = async () => {
      const data = await checkUser();
      setUser(data);
      setLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {  
  const fetchProducts = async () => {
    try {
      setProductsloading(true);
      const res = await getProducts();
      setProducts(res.data.products);
    } catch (err) {
      setError("Failed to fetch products");
      console.log(err);
    } finally {
      setProductsloading(false);
    }
  };
  fetchProducts();
  }, [user]);



  const ShowOrders = useCallback(async () => {
    try {
      const response = await getOrders();
      setOrders(response.data.orders);    
    } catch (error) {
      console.log("Server error", error);
    }
  }, []);   


   const fetchUser = useCallback(async () => {
    try {
      const response = await getalluser();
      setalluser(response.data.users);
      
    } catch (error) {
      console.log("Server error", error);
    }
  }, []); 



  const value: AdminContextValue = {
    user,
    setUser,
    loading,
    setLoading,
    isGuest,
    setIsGuest,
    products,
    setProducts,
    error,
    setError,
    productsloading,
    setProductsloading,
    ShowOrders,
    Orders,
    setOrders,
    fetchUser,
    alluser,
    setalluser,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export { AdminContext, AdminProvider };

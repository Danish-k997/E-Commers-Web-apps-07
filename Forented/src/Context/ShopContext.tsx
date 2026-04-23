import { createContext, useState, useEffect,useCallback } from "react";
import { checkUser } from "../utlis/checkuser.ts";
import {getOrders,cancelorder, getUserData, getAddresses, getCart} from "../Servers/ProducteServer.ts"
type UserType = {
  id: string;
  name?: string;
  email?: string;
  role?:string;
} | null;

type CartItem = {
  productId: Record<string, unknown> | string;
  quantity: number;
};  

type Order = {
  _id: string
  items: Array<{
    productId: Record<string, unknown>
    quantity: number
    price: number
  }>
  shippingAddress: {
    name: string
    phone: string
    city: string
    state: string
    pincode: string
  }
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  status: string
  createdAt: string
}

type AddressFormData = {
  name: string;
  phone: string;
  city: string;
  state: string;
  landmark?: string;
  pincode: string;
  country: string;
};  

type Address = {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

type ShopContextType = {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedPrice: string;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string>>;
  selectedSort: string;
  setSelectedSort: React.Dispatch<React.SetStateAction<string>>;
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
  isGuest: boolean;
  setIsGuest: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  formData: AddressFormData;
  setFormData: React.Dispatch<React.SetStateAction<AddressFormData>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  fetchOrders: () => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  UserData:UserType;
  setUserData: React.Dispatch<React.SetStateAction<UserType>>;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  getUsersData: () => Promise<void>;
  address: Address | null;
  setAddress: React.Dispatch<React.SetStateAction<Address | null>>;
  addressLoading: boolean;
  setAddressLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAddress: () => Promise<void>;
  toggleItemSelection: (id: string) => void
  selectAllItems: () => void
  clearSelection: () => void
};

type Props = {
  children: React.ReactNode;
};

const ShopContext = createContext<ShopContextType | null>(null);

const Shopprovider = ({ children }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [user, setUser] = useState<UserType>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
    const [addressLoading, setAddressLoading] = useState(false);
  const [UserData, setUserData] = useState<UserType>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [formData, setFormData] = useState<AddressFormData>({
    name: "",
    phone: "",
    city: "",
    state: "",
    landmark: "",
    pincode: "",
    country: "India"
  });

  useEffect(() => {
    const fetchUser = async () => {
      const data = await checkUser();
      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, []);   

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
   try {
    const respose = await getOrders() 
    setOrders(respose.data.orders || []);

   } catch (error) {
    console.log("Orders fail to fetch:",error);
    
   }
  }, [user?.id]);   

  const cancelOrder = async (orderId: string) => {
     try {
      await cancelorder(orderId);
      setOrders((prevOrders) => prevOrders.map(order => order._id === orderId ? { ...order, status: "cancelled" } : order));
     
     } catch (error) {
      await fetchOrders();
      console.log("Failed to cancel order:", error);
     }
  }
  

  const getUsersData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const respose = await getUserData() 
    setUserData(respose.data.user || null);
    } catch (error) {
      console.log("Failed to fetch user data:", error);
    }
  }, [user?.id]);

  
 const fetchAddress = useCallback(async () => {
  
     if (!user?.id) return;
      setAddressLoading(true);
      try {
        const response = await getAddresses(user?.id);
        const addresses = response.data.addresses || [];
        setAddress(addresses[0] || null);
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setAddressLoading(false);
      }
    },[user?.id]);

    
useEffect(() => {
  const fetchCartItems = async () => {
        if (!user?.id) return;
        try {
          const response = await getCart(user.id);
          setCartItems(response.data.cart.items || []);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      }; 
      fetchCartItems();   
}, [user?.id]);

  
const toggleItemSelection = useCallback((productId: string) => {
  setSelectedItems(prev =>
    prev.includes(productId)
      ? prev.filter(id => id !== productId)
      : [...prev, productId]
  )
}, [])

const selectAllItems = useCallback(() => {
  const allIds = cartItems.map(item =>
    typeof item.productId === 'string'
      ? item.productId
      : (item.productId as any)._id
  )
  setSelectedItems(allIds)
}, [cartItems])

const clearSelection = useCallback(() => {
  setSelectedItems([])
}, [])
      
    


  const value: ShopContextType = {
    selectedCategory,
    setSelectedCategory,
    selectedPrice,
    setSelectedPrice,
    selectedSort,
    setSelectedSort,
    user,
    setUser,
    isGuest,
    setIsGuest,
    loading,
    setLoading,
    cartItems,
    setCartItems,
    formData,
    setFormData,
     fetchOrders,
     orders,
     setOrders,
      cancelOrder,
      UserData,
      setUserData,
      getUsersData,
      address,
      setAddress,
      addressLoading,
      setAddressLoading,
      fetchAddress,
      selectedItems,
      setSelectedItems,
      toggleItemSelection,
      selectAllItems,
      clearSelection,
      
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export { ShopContext, Shopprovider };

import { API } from "./api";

export const getProducts = () => {
  return API.get("/products");
}; 

export const addProducts = (data: FormData) => {
  return API.post("/products/add", data, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data", 
    },
  });
}; 

export const deleteProduct = (id: string) => {
  return API.delete(`/products/${id}`);
};



export const updateProduct = (id: string, data: FormData) => {
  return API.put(`/products/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};  


export const getOrders = () => {
  return API.get("orders/my-orders") 
}   

export const getalluser = () => {
  return API.get("auth/alluser")
}

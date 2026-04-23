import axios from "axios";

export const checkUser = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/auth/profile", {
      withCredentials: true
    }); 

    return res.data.user;
  } catch {
    return null;
  }
};  


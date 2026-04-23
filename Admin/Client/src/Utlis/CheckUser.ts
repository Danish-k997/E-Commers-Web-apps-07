import axios from "axios";

export const checkUser = async () => {
  try {
    const res = await axios.get("https://e-commers-web-apps-07.onrender.com/api/auth/profile", {
      withCredentials: true
    }); 

    return res.data.user;
  } catch {
    return null;
  }
};  


import { assets } from "@/assets/assets";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(false); // ✅ Correct default
  const [image, setImage] = useState(assets.sample_img_1);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [credit, setCredit] = useState(0); // ✅ Correct default

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate()

  const loadCreditsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/credits`, {
        headers: {
        Authorization: `Bearer ${token}`, // ✅ Proper standard
      },
      });
      if (data.success) {
        setCredit(data.credit);
        setUser(data.user);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message || "Failed to load user/credit info");
    }
  };

 const generateImage = async (prompt) => {
  try {
    const { data } = await axios.post(
      `${backendUrl}/api/image/generate-image`,
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ correct way
        },
      }
    );

    if (data.message === "Image generated successfully") {
      loadCreditsData();
      return data.resultImage;
    } else {
      toast.error(data.message);
      loadCreditsData();
      if (data.creditBalance === 0) {
        navigate("/buy");
      }
    }
  } catch (e) {
    toast.error(e.message || "Image generation failed");
  }
};


  const logout = () => {
    localStorage.removeItem("token"); // ✅ Correct token key
    setToken("");
    setUser(null);
    setCredit(0);
    setShowLogin(true); // Optional
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);

  const valueContext = {
    user,
    setUser,
    image,
    setImage,
    showLogin,
    setShowLogin,
    backendUrl,
    token,
    setToken,
    credit,
    setCredit,
    loadCreditsData,
    logout,
    generateImage,
  };

  return (
    <AppContext.Provider value={valueContext}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash; 
    const queryString = hash.split("?")[1]; 
    if (!queryString) return;

    const params = new URLSearchParams(queryString);
    const token = params.get("token");
    const userId = params.get("user_id");

    if (token && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", userId);
      localStorage.setItem("isAuthenticated", "true");
      window.location.href = "/";
      navigate("/");
    }
  }, []);

  return ;
};

export default GoogleAuthSuccess;

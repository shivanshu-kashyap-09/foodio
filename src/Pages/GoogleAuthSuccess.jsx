import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async (token, userId) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const user = response.data.data;
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("role", user.role || 'user');
          toast.success("Login Successful!");
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Auth initialization failed. Please try manual login.");
        navigate("/login");
      }
    };

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
      fetchProfile(token, userId);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
        <p className="text-gray-600 font-bold">Completing authentication...</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;

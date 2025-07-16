import React, { useState, useEffect } from 'react';
import logo from "../assets/logo.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const USER_ID = localStorage.getItem('user_id');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

  useEffect(() => {
    const handleProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}/user/get/${USER_ID}`);
        if (res.status === 200) setUser(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    handleProfile();
  },[]);

  return (
    <header className={`w-screen px-4 py-2 flex items-center justify-between shadow-md fixed top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-red-200' : 'bg-transparent'}`}>
      <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="h-10 w-10" />
        <h2 className={`text-red-900 font-bold text-3xl px-2 ${isScrolled ? 'text-red-900' : 'text-red-100'}`}>FOODIO</h2>
      </div>

      <nav className="flex flex-wrap gap-3 justify-end mr-6">
        <a className={`font-semibold text-[18px] px-3 py-1 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'}`} href="/#home">Home</a>
        <a className={`font-semibold text-[18px] px-3 py-1 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'}`} href="/restaurant">Restaurant</a>
        <a className={`font-semibold text-[18px] px-3 py-1 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'}`} href="/cart">Cart</a>
        <a className={`font-semibold text-[18px] px-3 py-1 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'}`} href="/wishlist">Wishlist</a>
        <a className={`font-semibold text-[18px] px-3 py-1 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'}`} href="/choose">About Us</a>
        <a className={`font-semibold text-[18px] px-3 py-1 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'}`} href="/contact">Contact</a>
         {!user ? (
          <>
            <a className={`font-semibold text-[18px] px-3 py-1 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'}`} href="/login">Login</a>
            <a className={`font-semibold text-[18px] px-3 py-1 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'}`} href="/signup">Signup</a>
          </>
        ) : (
          <img
            onClick={() => navigate("/profile")}
            src={
                user.user_img
                  ? user.user_img.startsWith('http')
                    ? user.user_img
                    : `${import.meta.env.VITE_URL}${user.user_img}`
                  : "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
              }
            alt="profile"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-red-500"
          />
        )}
      </nav>
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from 'react';
import logo from "../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`w-full px-4 py-2 flex items-center justify-between shadow-md fixed top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-red-200' : 'bg-transparent'}`}>
      <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="h-8 w-8 sm:h-10 sm:w-10" />
        <h2 className={`text-red-900 font-bold text-2xl sm:text-3xl px-2 ${isScrolled ? 'text-red-900' : 'text-red-100'}`}>FOODIO</h2>
      </div>

      <button 
        className="lg:hidden text-red-900 focus:outline-none"
        onClick={toggleMenu}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      <nav className={`lg:flex flex-col lg:flex-row lg:flex-wrap lg:gap-3 lg:items-center absolute lg:static top-full left-0 w-full lg:w-auto bg-red-200 lg:bg-transparent transition-all duration-300 ${isMenuOpen ? 'flex' : 'hidden'}`}>
        <Link className={`font-semibold text-base sm:text-lg px-3 py-2 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'} lg:mx-1`} to="/">Home</Link>
        <Link className={`font-semibold text-base sm:text-lg px-3 py-2 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'} lg:mx-1`} to="/restaurant">Restaurant</Link>
        <Link className={`font-semibold text-base sm:text-lg px-3 py-2 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'} lg:mx-1`} to="/cart">Cart</Link>
        <Link className={`font-semibold text-base sm:text-lg px-3 py-2 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'} lg:mx-1`} to="/wishlist">Wishlist</Link>
        <Link className={`font-semibold text-base sm:text-lg px-3 py-2 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'} lg:mx-1`} to="/choose">About Us</Link>
        <Link className={`font-semibold text-base sm:text-lg px-3 py-2 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'} lg:mx-1`} to="/contact">Contact</Link>
        {!user ? (
          <>
            <Link className={`font-semibold text-base sm:text-lg px-3 py-2 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'} lg:mx-1`} to="/login">Login</Link>
            <Link className={`font-semibold text-base sm:text-lg px-3 py-2 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'} lg:mx-1`} to="/signup">Signup</Link>
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
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer border-2 border-red-500 mx-3 my-2 lg:mx-1 lg:my-0"
          />
        )}
      </nav>
    </header>
  );
};

export default Header;
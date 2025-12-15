import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../assets/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const USER_ID = localStorage.getItem('user_id');
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncUser = () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    };

    window.addEventListener("storage", syncUser);
    syncUser();

    return () => window.removeEventListener("storage", syncUser);
  }, []);


  useEffect(() => {
    const handleProfile = async () => {
      if (!USER_ID) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}/user/get/${USER_ID}`);
        if (res.status === 200) setUser(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    handleProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const headerVariants = {
    initial: { y: -100 },
    animate: { y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  const logoVariants = {
    rotate: {
      rotate: 360,
      transition: { duration: 20, repeat: Infinity, ease: "linear" }
    },
    hover: { scale: 1.1, transition: { duration: 0.2 } }
  };

  const menuItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    }),
    hover: { scale: 1.1, transition: { duration: 0.2 } }
  };

  return (
    <motion.header
      ref={headerRef}
      variants={headerVariants}
      initial="initial"
      animate="animate"
      className={`w-full px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between shadow-md fixed top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-red-200' : 'bg-transparent'}`}
    >
      <motion.div
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.img
          src={logo}
          alt="logo"
          className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
          variants={logoVariants}
          animate="rotate"
          whileHover="hover"
        />
        <motion.h2
          className={`text-red-900 font-bold text-xl sm:text-2xl lg:text-3xl px-2 ${isScrolled ? 'text-red-900' : 'text-red-100'}`}
          whileHover={{ scale: 1.1 }}
        >
          FOODIO
        </motion.h2>
      </motion.div>

      <motion.button
        className="lg:hidden text-red-900 focus:outline-none"
        onClick={toggleMenu}
        whileTap={{ scale: 0.9 }}
      >
        <motion.svg
          className="w-6 h-6 sm:w-7 sm:h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        <motion.nav
          className={`lg:flex flex-col lg:flex-row lg:gap-3 lg:items-center absolute lg:static top-full left-0 w-full lg:w-auto bg-red-200 lg:bg-transparent transition-all duration-300 ${isMenuOpen ? 'flex' : 'hidden'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {[
            { to: "/", label: "Home" },
            { to: "/restaurant", label: "Restaurant" },
            { to: "/cart", label: "Cart" },
            { to: "/wishlist", label: "Wishlist" },
            { to: "/choose", label: "Choose us" },
            { to: "/contact", label: "Contact" }
          ].map((item, i) => (
            <motion.div
              key={item.to}
              custom={i}
              variants={menuItemVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <Link
                className={`font-semibold text-sm sm:text-base lg:text-lg px-3 py-2 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'} lg:mx-1`}
                to={item.to}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}

          {!user ? (
            <>
              {[
                { to: "/login", label: "Login" },
                { to: "/signup", label: "Signup" }
              ].map((item, i) => (
                <motion.div
                  key={item.to}
                  custom={i + 6}
                  variants={menuItemVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                >
                  <Link
                    className={`font-semibold text-sm sm:text-base lg:text-lg px-3 py-2 rounded hover:bg-red-500 hover:text-white ${isScrolled ? 'text-red-900' : 'text-red-400'} lg:mx-1`}
                    to={item.to}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </>
          ) : (
            <motion.img
              onClick={() => navigate("/profile")}
              src={
                user.user_img
                  ? user.user_img.startsWith('https')
                    ? user.user_img
                    : `${import.meta.env.VITE_URL}${user.user_img}`
                  : "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
              }
              alt="profile"
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full cursor-pointer border-2 border-red-500 mx-3 my-2 lg:mx-1 lg:my-0"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
          )}
        </motion.nav>
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
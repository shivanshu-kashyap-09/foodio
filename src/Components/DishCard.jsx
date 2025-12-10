import axios from 'axios';
import React from 'react'
import { motion } from 'framer-motion';
import { FaHeart, FaRupeeSign, FaShoppingCart, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DishCard = ({ dish_name, dish_image, dish_description, dish_price, dish_rating }) => {
  const USER_ID = localStorage.getItem('user_id');

  const handleWhishList = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/whishlist/insert/${USER_ID}`, {
        dish_img: dish_image,
        dish_name,
        dish_price,
        dish_description
      });
      if (response.status == 201) {
        toast.success("dish add in whishlist");
        return;
      }
    } catch (error) {
      toast.error("dish is not add in whishlist");
      console.error(error);
    }
  }

  const handleCart = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/cart/insert/${USER_ID}`, {
        dish_img: dish_image,
        dish_name,
        dish_price,
        dish_description,
        dish_qty: 1,
      });
      if (response.status == 201) {
        toast.success("dish sussessfully add in cart");
      }
    } catch (error) {
      toast.error("dish is not add in cart!");
      console.error(error);
    }
  }

  const cardVariants = {
    rest: { 
      scale: 1,
      y: 0
    },
    hover: { 
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="w-full max-w-xs sm:w-64 rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50 shadow-lg hover:shadow-xl p-6 relative text-center mx-auto border border-red-100/50"
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <div className="relative">
        <motion.img 
          src={dish_image} 
          alt={dish_name} 
          className="rounded-full mx-auto w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover shadow-md"
          variants={imageVariants}
        />
        <motion.div 
          className="absolute top-0 -right-2 sm:-right-4 bg-red-500 text-red-200 hover:bg-red-300 hover:text-red-600 rounded-full p-2 cursor-pointer" 
          onClick={handleCart}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaShoppingCart className="text-xs sm:text-sm h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
        </motion.div>
        <motion.div 
          className="absolute top-8 sm:top-11 -right-2 sm:-right-4 bg-red-500 text-red-200 hover:bg-red-300 hover:text-red-600 rounded-full p-2 cursor-pointer" 
          onClick={handleWhishList}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaHeart className="text-xs sm:text-sm h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
        </motion.div>
        <motion.div 
          className="absolute top-16 sm:top-10 lg:top-22 -right-2 sm:-right-4 bg-green-700 text-red-200 hover:bg-green-600 hover:text-red-600 rounded-full p-2"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaStar className="text-xs sm:text-sm h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
        </motion.div>
        <motion.p 
          className='absolute top-24 sm:top-20 lg:top-32 -right-1 text-green-700 font-semibold text-xs sm:text-sm'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {dish_rating}
        </motion.p>
      </div>
      <motion.div 
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-base sm:text-lg font-bold text-red-900 truncate">{dish_name}</h3>
        <p className="text-xs sm:text-sm text-red-800 line-clamp-2">{dish_description}</p>
        <motion.div 
          className="mt-2 flex items-center justify-center text-sm sm:text-md font-semibold text-red-900"
          whileHover={{ scale: 1.1 }}
        >
          <FaRupeeSign className="mr-1 text-xs sm:text-sm" />
          {dish_price}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default DishCard
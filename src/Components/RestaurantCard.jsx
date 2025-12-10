import React from 'react'
import { motion } from 'framer-motion';
import { FaHeart, FaPhone, FaRupeeSign, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant, type }) => {
  const navigate = useNavigate();
  const handleRestaurantById = async () => {
    navigate(`/restaurant/${type}/${restaurant.res_name}/${restaurant.res_id}`)
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div 
      className="w-full max-w-xs sm:w-64 rounded-3xl bg-gradient-to-br from-red-50 via-white to-red-100 shadow-xl p-6 relative text-center mx-auto cursor-pointer transform-gpu"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      onClick={handleRestaurantById}>
      <motion.div className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}>
        <motion.img 
          src={restaurant.res_img} 
          alt={restaurant.res_name} 
          className="rounded-full mx-auto w-32 h-32 sm:w-40 sm:h-40 object-cover shadow-md"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        />
        <motion.div 
          className="absolute -top-2 -right-4 sm:-right-3 bg-green-700 text-green-200 hover:bg-green-600 hover:text-white rounded-full p-2 transform-gpu"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.3 }}>
          <FaStar className="text-sm h-5 w-5 sm:h-6 sm:w-6" />
        </motion.div>
        <motion.p 
          className='absolute top-7 sm:top-10 -right-4 text-green-700 font-semibold text-sm sm:text-base'
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}>
          {restaurant.res_rating}
        </motion.p>
      </motion.div>
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}>
        <motion.h3 
          className="text-base sm:text-lg font-bold text-red-900 mb-2"
          whileHover={{ scale: 1.05 }}>
          {restaurant.res_name}
        </motion.h3>
        <motion.div 
          className="mt-2 flex items-center justify-center text-sm sm:text-md font-semibold text-red-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          {restaurant.res_address || restaurant.res_location}
        </motion.div>
        <motion.div 
          className="mt-2 flex items-center justify-center text-sm sm:text-md font-semibold text-red-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}>
          <FaPhone className="mr-2 text-xs sm:text-sm" />
          {restaurant.res_phone}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default RestaurantCard
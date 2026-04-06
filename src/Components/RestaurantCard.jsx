import React from 'react'
import { motion } from 'framer-motion';
import { FaHeart, FaPhone, FaRupeeSign, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant, type }) => {
  const navigate = useNavigate();
  const res_name = restaurant.restaurant_name || restaurant.res_name;
  const res_id = restaurant.id || restaurant.res_id;
  const res_img = restaurant.restaurant_img || restaurant.res_img;
  const res_rating = restaurant.rating || restaurant.res_rating;
  const res_address = restaurant.restaurant_address || restaurant.res_address || restaurant.res_location;
  const res_phone = restaurant.restaurant_phone || restaurant.res_phone;

  const handleRestaurantById = async () => {
    navigate(`/restaurant/${type}/${res_name}/${res_id}`)
  }

  // ... (container variants omitted for clarity, but I'll keep the full structure in tool call)
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
      className="w-full max-w-[280px] rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-6 relative text-center mx-auto cursor-pointer transform-gpu overflow-hidden group"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover="hover"
      whileTap="tap"
      onClick={handleRestaurantById}>
      <motion.div className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}>
        <motion.img 
          src={res_img} 
          alt={res_name} 
          className="rounded-full mx-auto w-32 h-32 sm:w-40 sm:h-40 object-cover shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-4 border-white"
          whileHover={{ scale: 1.05, rotate: 3 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        />
        <motion.div 
          className="absolute -top-2 -right-4 sm:-right-3 bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg rounded-full p-2.5 transform-gpu ring-2 ring-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.3 }}>
          <FaStar className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.div>
        <motion.p 
          className='absolute top-9 sm:top-12 -right-2 text-yellow-600 font-extrabold text-sm sm:text-base drop-shadow-sm'
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}>
          {res_rating}
        </motion.p>
      </motion.div>
      <motion.div 
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}>
        <motion.h3 
          className="text-lg sm:text-xl font-extrabold text-gray-900 mb-2 truncate px-2"
          whileHover={{ scale: 1.02 }}>
          {res_name}
        </motion.h3>
        <motion.div 
          className="mt-3 flex items-start justify-center gap-2 text-sm font-medium text-gray-600 line-clamp-2 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          <span className="text-red-500 mt-1">📍</span>
          <span>{res_address}</span>
        </motion.div>
        <motion.div 
          className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center text-sm font-bold text-red-600 bg-red-50/50 rounded-xl py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}>
          <FaPhone className="mr-2" />
          {res_phone}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
export default RestaurantCard
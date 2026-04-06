import React from 'react';
import { motion } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa';

const HeroRestaurant = ({ restaurantName, dishes, link }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl border border-red-100 shadow-xl p-5 w-full max-w-sm mb-6 hover:shadow-2xl transition-all group"
    >
      <h2 className="text-xl font-extrabold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-orange-600 text-center tracking-tight">
        {restaurantName}
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {dishes.map((dish, index) => (
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-center group-hover:bg-red-50/50 p-2 rounded-xl transition-colors" 
            key={index}
          >
            <div className="overflow-hidden rounded-xl shadow-md mb-3 aspect-square bg-gray-100">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />
            </div>
            <p className="text-sm font-bold text-gray-800 truncate px-1">{dish.name}</p>
            <p className="text-sm font-medium text-orange-600 mt-0.5">{dish.price}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <a
          href={link}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 hover:bg-gradient-to-r hover:from-red-600 hover:to-orange-500 hover:text-white rounded-full font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md"
        >
          Explore Full Menu
          <FaChevronRight className="text-xs" />
        </a>
      </div>
    </motion.div>
  );
};

export default HeroRestaurant;

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Menu = ({ menu }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="relative py-4"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="space-y-4">
        {menu.map((dish, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-4 border-l-4 border-red-500"
          >
            <div className="grid grid-cols-2 gap-4 items-center">
              <motion.h2 
                className="text-base sm:text-lg lg:text-xl font-bold text-gray-800"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {dish.dish_name}
              </motion.h2>
              <motion.h2 
                className="text-base sm:text-lg lg:text-xl font-semibold text-red-600 text-right"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                ₹{dish.dish_price}
              </motion.h2>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Menu;
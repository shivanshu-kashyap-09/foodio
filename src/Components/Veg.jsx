import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DishCard from './DishCard';
import { FaFilter, FaSearch } from 'react-icons/fa';
import Filter from '../Components/Filter';

const Veg = ({vegDish}) => {
  const [filter, setFilter] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const filterRef = useRef(null);
  const searchRef = useRef(null);

  const allDishes = [
    "Paneer", "Pav Bhaji", "Veg Biryani", "Masala Dosa",
    "Aloo Tikki", "Veg Burger", "Rajma Chawal", "Palak Paneer",
    "Mix Veg", "Chole Bhature", "Malai Kofta", "Dal Makhani"
  ];

  const handleFilter = () => {
    setFilter(!filter);
  };

  const handleSearch = () => {
    if (searchVisible && searchQuery.trim() !== '') {
      const result = allDishes.filter(d =>
        d.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(result);
    }
    setSearchVisible(!searchVisible);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target) && !e.target.closest('.filter-button')) {
        setFilter(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target) && !e.target.closest('.search-button')) {
        setSearchVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div
      initial="visible"
      animate="visible"
      variants={containerVariants}
      className="py-8 sm:py-12"
    >
      <div className='relative flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 mb-6 px-4 sm:px-6 md:px-8'>
        <motion.h2 
          className='text-red-900 font-bold text-2xl sm:text-3xl md:text-4xl text-left sm:ml-[40%]'
          variants={itemVariants}
        >
          VEG FOOD
        </motion.h2>
        <motion.div 
          className="flex items-center gap-3 flex-wrap"
          variants={itemVariants}
        >
          <div className="flex gap-3">
            <motion.button
              className="bg-red-500 text-red-200 hover:bg-red-300 hover:text-red-600 rounded-full p-2 search-button"
              onClick={handleSearch}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaSearch className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.button>
            <motion.button
              className="bg-red-500 text-red-200 hover:bg-red-300 hover:text-red-600 rounded-full p-2 filter-button sm:mr-10"
              onClick={handleFilter}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaFilter className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.button>
          </div>
          <AnimatePresence>
            {searchVisible && (
              <motion.div 
                className="border-2 rounded-2xl px-3 h-10 flex items-center text-red-500 w-full sm:w-64" 
                ref={searchRef}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <input
                  type="text"
                  placeholder="Enter a Dish Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none border-none bg-transparent text-red-500 placeholder-red-400 w-full text-sm sm:text-base"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <AnimatePresence>
          {filter && (
            <motion.div 
              ref={filterRef} 
              className="absolute right-4 top-12 sm:right-6 sm:top-16 z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Filter />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div 
        className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mx-4 sm:mx-6 md:mx-8 lg:mx-12'
        variants={containerVariants}
      >
        {(searchVisible && searchQuery && filteredData.length > 0 ? filteredData : vegDish).slice(0,8).map((dish, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            initial="visible"
            whileHover="hover"
            className="transform-gpu"
          >
            <DishCard {...dish} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Veg;
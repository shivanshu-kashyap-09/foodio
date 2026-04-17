import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DishCard from './DishCard';
import { FaFilter, FaSearch, FaChevronRight, FaTimes } from 'react-icons/fa';
import Filter from '../Components/Filter';
import axios from 'axios';

const Veg = ({ vegDish }) => {
  const [filter, setFilter] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ price: '', rating: '', delivery: '' });
  const [visibleCount, setVisibleCount] = useState(12);
  const filterRef = useRef(null);
  const searchRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Memoized filtered data for performance
  const displayItems = useMemo(() => {
    if (!vegDish || vegDish.length === 0) return [];

    let filtered = vegDish.map(dish => ({
      ...dish,
      restaurant_id: dish.res_id || dish.restaurant_id || 2
    }));

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => {
        const name = String(item.dish_name ?? item.item_name ?? "").toLowerCase();
        const desc = String(item.dish_description ?? item.item_description ?? "").toLowerCase();
        return name.includes(query) || desc.includes(query);
      });
    }

    if (activeFilters.price) {
      filtered = filtered.filter(item => {
        const price = item.dish_price || item.item_price || 0;
        if (activeFilters.price === '100') return price < 100;
        if (activeFilters.price === '300') return price < 300;
        if (activeFilters.price === '600') return price < 600;
        if (activeFilters.price === '900') return price < 900;
        if (activeFilters.price === '999') return price >= 999;
        return true;
      });
    }

    if (activeFilters.rating) {
      filtered = filtered.filter(item => {
        const rating = item.dish_rating ?? item.item_rating ?? 0;
        return rating >= Number(activeFilters.rating);
      });
    }

    return filtered;
  }, [vegDish, searchQuery, activeFilters]);

  const handleDishUpdate = (updatedDish) => {
    // Parent handle update if passed, logic normally handled in Home.jsx via props
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target) && !e.target.closest('.filter-button')) {
        setFilter(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target) && !e.target.closest('.search-button')) {
        if (!searchQuery) setSearchVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  useEffect(() => {
    if (vegDish && vegDish.length > 0) {
      setLoading(false);
    }
  }, [vegDish]);

  return (
    <div className="py-12 sm:py-20 bg-gradient-to-b from-white to-red-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="h-1 w-12 bg-red-600 rounded-full"></div>
              <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.2em]">Gastronomy</span>
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter"
            >
              THE <span className="text-red-600 italic">VEG</span> CLASSICS
            </motion.h2>
            <p className="text-gray-500 font-medium max-w-md">Discover ultra-fresh, farm-to-table vegetarian delights crafted by top-tier chefs across your city.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center" ref={searchRef}>
              <AnimatePresence>
                {searchVisible && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden mr-2"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search veg..."
                      className="w-48 sm:w-64 px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setSearchVisible(!searchVisible)}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-sm search-button ${searchVisible ? 'bg-red-600 text-white' : 'bg-white text-gray-400 hover:text-red-600 hover:bg-red-50'
                  }`}
              >
                {searchVisible && searchQuery ? (
                  <FaTimes onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery('');
                  }} />
                ) : (
                  <FaSearch />
                )}
              </button>
            </div>

            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilter(!filter)}
                className={`h-12 px-6 flex items-center gap-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm filter-button ${filter ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <FaFilter className={filter ? 'text-red-500' : 'text-gray-400'} />
                Filter
              </button>

              <AnimatePresence>
                {filter && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute right-0 mt-4 z-[40]"
                  >
                    <Filter activeFilters={activeFilters} setActiveFilters={setActiveFilters} onClose={() => setFilter(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Dynamic Grid */}
        <AnimatePresence mode="popLayout">

          {/* 🔥 SKELETON LOADER */}
          {loading ? (
            <motion.div
              key="skeleton-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-[260px] rounded-2xl bg-gray-100 animate-pulse flex flex-col overflow-hidden"
                >
                  <div className="h-[60%] bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </motion.div>

          ) : displayItems.length > 0 ? (

            <motion.div
              key="actual-data"
              layout
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {displayItems.slice(0, visibleCount).map((dish, index) => (
                <motion.div
                  key={`${dish.dish_id || dish.id}-${index}`}   // ✅ FIXED KEY
                  layout
                  variants={itemVariants}
                >
                  <DishCard
                    restaurant_id={dish.restaurant_id}
                    dish_id={dish.dish_id || dish.id}
                    menuType="veg"

                    dish_name={dish.dish_name ?? dish.item_name ?? "No Name"}
                    dish_image={dish.dish_image ?? dish.item_image ?? dish.dish_img ?? ""}
                    dish_description={dish.dish_description ?? dish.item_description ?? dish.dish_desc ?? ""}
                    dish_price={dish.dish_price ?? dish.item_price ?? 0}
                    dish_rating={dish.dish_rating ?? dish.item_rating ?? 0}

                    onEdit={handleDishUpdate}
                  />
                </motion.div>
              ))}
            </motion.div>

          ) : (

            <motion.div
              key="no-data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 text-3xl">
                <FaSearch />
              </div>
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">
                No delicacies found
              </h3>
              <p className="text-gray-400 text-sm mt-2 font-medium">
                Try adjusting your search criteria
              </p>
            </motion.div>

          )}

        </AnimatePresence>

        {/* View All Action */}
        {!searchQuery && displayItems.length > visibleCount && visibleCount < 20 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-16 flex justify-center"
          >
            <button
              onClick={() => setVisibleCount(20)}
              className="group flex items-center gap-4 px-10 py-5 bg-white border-2 border-gray-100 rounded-full font-black text-xs uppercase tracking-widest text-gray-600 hover:border-red-600 hover:text-red-600 transition-all shadow-sm"
            >
              Explore More Dishes
              <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Veg;
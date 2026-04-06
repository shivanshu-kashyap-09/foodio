import React from 'react';
import { motion } from 'framer-motion';
import { FaFilter } from 'react-icons/fa';

const Filter = ({ activeFilters, setActiveFilters, onClose }) => {
  const { price, rating, delivery } = activeFilters;

  const handleChange = (field, value) => {
    setActiveFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setActiveFilters({ price: '', rating: '', delivery: '' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className='w-full sm:w-80 md:w-96 z-20 absolute right-4 sm:right-10 top-0 sm:-top-5 bg-white/90 backdrop-blur-md border border-red-100 shadow-2xl rounded-3xl p-6'
    >
      <div className="flex items-center justify-center gap-3 mb-6 border-b border-red-100 pb-4">
        <FaFilter className="text-red-600 text-xl" />
        <h2 className='text-red-900 font-extrabold text-2xl tracking-wide'>Filters</h2>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col gap-2">
          <label className='font-bold text-sm text-red-800 uppercase tracking-wider ml-1'>Price Range</label>
          <select
            className='w-full h-12 px-4 rounded-xl font-medium text-red-900 bg-red-50 border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all cursor-pointer appearance-none'
            value={price}
            onChange={(e) => handleChange('price', e.target.value)}
          >
            <option value="" disabled className='text-gray-500'>Select Price Range</option>
            <option value="100">Below ₹100</option>
            <option value="300">Below ₹300</option>
            <option value="600">Below ₹600</option>
            <option value="900">Below ₹900</option>
            <option value="999">₹999+</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className='font-bold text-sm text-red-800 uppercase tracking-wider ml-1'>Minimum Rating</label>
          <select
            className='w-full h-12 px-4 rounded-xl font-medium text-red-900 bg-red-50 border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all cursor-pointer appearance-none'
            value={rating}
            onChange={(e) => handleChange('rating', e.target.value)}
          >
            <option value="" disabled className='text-gray-500'>Select Rating</option>
            <option value="5">★★★★★ (5 Stars)</option>
            <option value="4">★★★★☆ (4+ Stars)</option>
            <option value="3">★★★☆☆ (3+ Stars)</option>
            <option value="2">★★☆☆☆ (2+ Stars)</option>
            <option value="1">★☆☆☆☆ (1+ Stars)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className='font-bold text-sm text-red-800 uppercase tracking-wider ml-1'>Delivery Time</label>
          <select
            className='w-full h-12 px-4 rounded-xl font-medium text-red-900 bg-red-50 border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all cursor-pointer appearance-none'
            value={delivery}
            onChange={(e) => handleChange('delivery', e.target.value)}
          >
            <option value="" disabled className='text-gray-500'>Select Delivery Option</option>
            <option value="fast">Fast Delivery (under 30 mins)</option>
            <option value="standard">Standard Delivery</option>
          </select>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end gap-3">
        <button 
          onClick={handleReset}
          className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Reset
        </button>
        <button 
          onClick={onClose}
          className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          Apply Filters
        </button>
      </div>
    </motion.div>
  );
};

export default Filter;

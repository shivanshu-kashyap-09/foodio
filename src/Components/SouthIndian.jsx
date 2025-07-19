import React, { useState, useRef, useEffect } from 'react';
import DishCard from './DishCard';
import { FaFilter, FaSearch } from 'react-icons/fa';
import Filter from '../Components/Filter';

const SouthIndian = ({southDish}) => {
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

  return (
    <>
      <div className='relative flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 mb-6 px-4 sm:px-6 md:px-8'>
        <h2 className='text-red-900 font-bold text-2xl sm:text-3xl md:text-4xl text-left sm:ml-[40%]'>SOUTH INDIAN FOOD</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-3">
            <button
              className="bg-red-500 text-red-200 hover:bg-red-300 hover:text-red-600 rounded-full p-2 filter-button"
              onClick={handleFilter}
            >
              <FaFilter className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              className="bg-red-500 text-red-200 hover:bg-red-300 hover:text-red-600 rounded-full p-2 search-button sm:mr-10"
              onClick={handleSearch}
            >
              <FaSearch className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          {searchVisible && (
            <div className="border-2 rounded-2xl px-3 h-10 flex items-center text-red-500 w-full sm:w-64" ref={searchRef}>
              <input
                type="text"
                placeholder="Enter a Dish Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none border-none bg-transparent text-red-500 placeholder-red-400 w-full text-sm sm:text-base"
              />
            </div>
          )}
        </div>
        {filter && (
          <div ref={filterRef} className="absolute right-4 top-12 sm:right-6 sm:top-16 z-10">
            <Filter />
          </div>
        )}
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mx-4 sm:mx-6 md:mx-8 lg:mx-12'>
        {(searchVisible && searchQuery && filteredData.length > 0 ? filteredData : southDish).slice(0,8).map((dish, index) => (
          <DishCard key={index} {...dish} />
        ))}
      </div>
    </>
  )
}

export default SouthIndian
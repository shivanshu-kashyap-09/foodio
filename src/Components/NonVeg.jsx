import React, { useState, useRef, useEffect } from 'react';
import DishCard from './DishCard';
import { FaFilter, FaSearch } from 'react-icons/fa';
import Filter from '../Components/Filter';

const NonVeg = ({nonVegDish}) => {
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
        <div className='bg-red-50'>
          <div className='relative flex flex-row items-center gap-4 mt-4 mb-6 bg-red-50'>
                  <h2 className='text-red-900 font-bold text-4xl ml-130 mr-65'>NONVEG FOOD</h2>
                  <div className="flex gap-3">
                    <button
                      className="bg-red-500 text-red-200 hover:bg-red-300 hover:text-red-600 rounded-full p-2 filter-button"
                      onClick={handleFilter}
                    >
                      <FaFilter className="h-6 w-6" />
                    </button>
          
                    <button
                      className="bg-red-500 text-red-200 hover:bg-red-300 hover:text-red-600 rounded-full p-2 search-button"
                      onClick={handleSearch}
                    >
                      <FaSearch className="h-6 w-6" />
                    </button>
          
                    {searchVisible && (
                      <div className="border-2 rounded-2xl px-3 h-10 flex items-center text-red-500" ref={searchRef}>
                        <input
                          type="text"
                          placeholder="Enter a Dish Name"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="outline-none border-none bg-transparent text-red-500 placeholder-red-400"
                        />
                      </div>
                    )}
                  </div>
          
                  {filter && (
                    <div ref={filterRef}>
                      <Filter />
                    </div>
                  )}
                </div>
    
          <div className='grid grid-cols-4 gap-6 mx-22'>
            {(searchVisible && searchQuery && filteredData.length > 0 ? filteredData : nonVegDish).slice(0,8).map((dish, index) => (
          <DishCard key={index} {...dish} />
        ))}
          </div>
        </div>
  )
}

export default NonVeg
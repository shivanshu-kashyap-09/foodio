import React, { useEffect, useState } from 'react';
import axios from 'axios';

import RestaurantCard from "../Components/RestaurantCard";
import Menu from "../Components/Menu";
import DishCard from "../Components/DishCard";

// ✅ helper to extract data safely
const extractData = (res) => res?.data?.data || res?.data?.items || [];

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState({
    veg: [],
    nonveg: [],
    south: []
  });

  const [menus, setMenus] = useState({
    veg: [],
    nonveg: [],
    south: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = import.meta.env.VITE_URL;

  // 🔥 reusable fetch
  const fetchData = async (endpoint) => {
    const res = await axios.get(`${API}${endpoint}`);
    return extractData(res);
  };

  // 🚀 fetch all restaurants + menus
  const loadData = async () => {
    try {
      setLoading(true);

      const [
        vegRes,
        nonVegRes,
        southRes,
        vegMenu,
        nonVegMenu,
        southMenu
      ] = await Promise.all([
        fetchData('/restaurants/veg'),
        fetchData('/restaurants/nonveg'),
        fetchData('/restaurants/southindian'),
        fetchData('/menus/veg'),
        fetchData('/menus/nonveg'),
        fetchData('/menus/southindian')
      ]);

      setRestaurants({
        veg: vegRes,
        nonveg: nonVegRes,
        south: southRes
      });

      setMenus({
        veg: vegMenu,
        nonveg: nonVegMenu,
        south: southMenu
      });

    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🧠 reusable section component
  const renderSection = (title, resList, menuList, type) => (
    <>
      <h2 className='text-red-900 font-bold text-2xl sm:text-3xl lg:text-4xl text-center mt-8 mb-8'>
        {title}
      </h2>

      {/* Restaurants */}
      <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center'>
        {(resList || []).slice(0, 4).map((res, index) => (
          <RestaurantCard key={index} restaurant={res} type={type} />
        ))}
      </div>

      {/* Selected Restaurant Name */}
      {resList.length > 0 && (
        <h2 className='text-red-900 font-bold text-2xl sm:text-3xl lg:text-4xl text-center mt-8 mb-8'>
          {resList[0]?.res_name}
        </h2>
      )}

      {/* Menu + Dishes */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mx-auto max-w-7xl items-start">
        <div className='w-full lg:w-1/4 border-2 border-red-700 p-4 bg-white rounded-xl shadow-md'>
          <h2 className='hidden sm:block text-red-900 font-bold text-xl sm:text-2xl lg:text-3xl text-center border-b-2 bg-red-50 py-2'>
            MENU
          </h2>
          <Menu menu={menuList} />
        </div>

        <div className="w-full lg:w-3/4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(menuList || []).map((dish, index) => (
            <DishCard key={index} {...dish} />
          ))}
        </div>
      </div>
    </>
  );

  // 🚨 loading state
  if (loading) {
    return (
      <div className="mt-20 text-center text-xl font-semibold">
        Loading restaurants & menus...
      </div>
    );
  }

  // 🚨 error state
  if (error) {
    return (
      <div className="mt-20 text-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className='mt-20 mb-4 px-4 sm:px-6 lg:px-8'>

      {renderSection(
        "VEG RESTAURANT",
        restaurants.veg,
        menus.veg,
        "veg"
      )}

      {renderSection(
        "NONVEG RESTAURANT",
        restaurants.nonveg,
        menus.nonveg,
        "nonveg"
      )}

      {renderSection(
        "SOUTH INDIAN RESTAURANT",
        restaurants.south,
        menus.south,
        "south"
      )}

    </div>
  );
};

export default Restaurant;
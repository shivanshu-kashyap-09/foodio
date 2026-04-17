import React, { useEffect, useState } from 'react';
import axios from 'axios';

import RestaurantCard from "../Components/RestaurantCard";
import Menu from "../Components/Menu";
import DishCard from "../Components/DishCard";

const DISH_LIMIT = 8;
const RESTAURANT_LIMIT = 8;
const cuisineApiMap = {
  veg: 'veg',
  nonveg: 'nonveg',
  south: 'southindian',
};

const Restaurant = () => {
  const [sections, setSections] = useState({
    veg: {
      restaurants: [],
      menus: [],
      restaurantPage: 1,
      restaurantPages: 1,
      menuPage: 1,
      menuPages: 1,
      loading: false,
    },
    nonveg: {
      restaurants: [],
      menus: [],
      restaurantPage: 1,
      restaurantPages: 1,
      menuPage: 1,
      menuPages: 1,
      loading: false,
    },
    south: {
      restaurants: [],
      menus: [],
      restaurantPage: 1,
      restaurantPages: 1,
      menuPage: 1,
      menuPages: 1,
      loading: false,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = import.meta.env.VITE_URL;

  const fetchRestaurants = async (type, next = false) => {
    try {
      setSections((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: true },
      }));

      const currentPage = sections[type].restaurantPage;
      const page = next ? currentPage + 1 : 1;
      const apiType = cuisineApiMap[type];
      const res = await axios.get(`${API}/restaurants/${apiType}?page=${page}&limit=${RESTAURANT_LIMIT}`);

      const restaurants = next
        ? [...sections[type].restaurants, ...(res.data.data || [])]
        : (res.data.data || []);

      setSections((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          restaurants,
          restaurantPage: res.data.pagination?.page || page,
          restaurantPages: res.data.pagination?.pages || 1,
          loading: false,
        },
      }));
    } catch (err) {
      console.error(`Failed to fetch ${type} restaurants`, err);
      setError('Failed to load restaurants');
      setSections((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: false },
      }));
    }
  };

  const fetchMenus = async (type, next = false) => {
    try {
      setSections((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: true },
      }));

      const currentPage = sections[type].menuPage;
      const page = next ? currentPage + 1 : 1;
      const apiType = cuisineApiMap[type];
      const res = await axios.get(`${API}/menus/${apiType}?page=${page}&limit=${DISH_LIMIT}`);

      const menus = next
        ? [...sections[type].menus, ...(res.data.data || [])]
        : (res.data.data || []);

      setSections((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          menus,
          menuPage: res.data.pagination?.page || page,
          menuPages: res.data.pagination?.pages || 1,
          loading: false,
        },
      }));
    } catch (err) {
      console.error(`Failed to fetch ${type} menu items`, err);
      setError('Failed to load dish menu');
      setSections((prev) => ({
        ...prev,
        [type]: { ...prev[type], loading: false },
      }));
    }
  };

  const loadSection = async (type) => {
    await Promise.all([fetchRestaurants(type), fetchMenus(type)]);
  };

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      await Promise.all(['veg', 'nonveg', 'south'].map((type) => loadSection(type)));
    } catch (err) {
      console.error(err);
      setError('Failed to load restaurant data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const renderSection = (title, type) => {
    const section = sections[type];

    return (
      <section className="mb-16">
        <div className="flex flex-col gap-4 items-center mb-8">
          <h2 className="text-red-900 font-bold text-2xl sm:text-3xl lg:text-4xl text-center">
            {title}
          </h2>
          {section.restaurantPages > 1 && (
            <p className="text-gray-500 text-sm">Page {section.restaurantPage} of {section.restaurantPages}</p>
          )}
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center'>
          {section.restaurants.map((res) => (
            <RestaurantCard key={res.res_id || res.id} restaurant={res} type={type} />
          ))}
        </div>

        {section.restaurantPage < section.restaurantPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchRestaurants(type, true)}
              className="px-6 py-3 rounded-full bg-red-600 text-white font-bold uppercase tracking-wider text-xs shadow-lg hover:bg-red-700 transition-all"
            >
              Load More Restaurants
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mx-auto max-w-7xl items-start mt-12">
          <div className='w-full lg:w-1/4 border-2 border-red-700 p-4 bg-white rounded-xl shadow-md'>
            <h2 className='hidden sm:block text-red-900 font-bold text-xl sm:text-2xl lg:text-3xl text-center border-b-2 bg-red-50 py-2'>
              MENU
            </h2>
            <Menu menu={section.menus} />
          </div>

          <div className="w-full lg:w-3/4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.menus.map((dish) => (
              <DishCard key={dish.dish_id || dish.id} {...dish} />
            ))}
          </div>
        </div>

        {section.menuPage < section.menuPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchMenus(type, true)}
              className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold uppercase tracking-wider text-xs shadow-lg hover:bg-blue-700 transition-all"
            >
              See More Dishes
            </button>
          </div>
        )}
      </section>
    );
  };

  if (loading) {
    return (
      <div className="mt-20 p-6 space-y-4 max-w-7xl mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-4 items-center">
            <div className="w-16 h-16 bg-gray-300 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-20 text-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className='mt-20 mb-4 px-4 sm:px-6 lg:px-8'>
      {renderSection('VEG RESTAURANT', 'veg')}
      {renderSection('NONVEG RESTAURANT', 'nonveg')}
      {renderSection('SOUTH INDIAN RESTAURANT', 'south')}
    </div>
  );
};

export default Restaurant;

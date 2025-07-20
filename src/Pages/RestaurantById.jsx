import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Menu from '../Components/Menu';
import DishCard from '../Components/DishCard';
import RestaurantCard from '../Components/RestaurantCard';

const RestaurantById = () => {
    const { type, res_id, res_name } = useParams();
    const [dishes, setDishes] = useState([]);
    const [menu, setMenu] = useState([]);
    const [allRestaurants, setAllRestaurants] = useState([]);

    const handleResMenu = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/${type}menu/id/${res_id}`);
            if (response.status === 200) {
                setMenu(response.data);
            }
        } catch (error) {
            console.error("Error fetching menu:", error);
        }
    };

    const handleDishesById = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/${type}menu/restaurant/${res_id}`);
            if (response.status === 200) {
                setDishes(response.data);
            }
        } catch (error) {
            console.error("Error fetching dish:", error);
        }
    };

    const handleAllRestaurantsByType = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/${type}restaurant/all`);
            if (response.status === 200) {
                setAllRestaurants(response.data);
            }
        } catch (error) {
            console.error("Error fetching all restaurants:", error);
        }
    };

    useEffect(() => {
        handleDishesById();
        handleResMenu();
        handleAllRestaurantsByType();
    }, [type, res_id]);

    return (
        <div className="mt-16 sm:mt-20 md:mt-24 mb-6 sm:mb-8 lg:mb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <h2 className="text-red-900 font-bold text-2xl sm:text-3xl md:text-4xl text-center mt-4 sm:mt-5 mb-6 sm:mb-8 md:mb-10">{res_name}</h2>
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mx-0 sm:mx-4">
                <div className="w-full md:w-1/4 border-2 border-red-700 p-3 sm:p-4 bg-white rounded-xl shadow-md">
                    <h2 className="hidden sm:block text-red-900 font-bold text-xl sm:text-2xl md:text-3xl text-center border-b-2 bg-red-50 py-2">MENU</h2>
                    <Menu menu={menu} />
                </div>
                <div className="w-full md:w-3/4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {dishes.slice(0, 9).map((dish, index) => (
                        <DishCard key={index} {...dish} />
                    ))}
                </div>
            </div>
            <h2 className="text-red-900 font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center mt-8 sm:mt-10 md:mt-12 mb-4 sm:mb-6">Similar Restaurants</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {allRestaurants.map((restaurant, index) => (
                    <RestaurantCard
                        key={index}
                        restaurant={restaurant}
                        type={type}
                    />
                ))}
            </div>
        </div>
    );
};

export default RestaurantById;
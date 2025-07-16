// RestaurantById.jsx (Fixed and working as per your exact flow)

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
                console.log(response);
                setMenu(response.data);
            }
        } catch (error) {
            console.error("Error fetching menu:", error);
        }
    };

    const handleDishesById = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_URL}/${type}menu/id/${res_id}`);
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
        <div className='mt-24 mb-10 px-6'>
            <h2 className='text-red-900 font-bold text-4xl text-center mt-5 mb-10'>{res_name}</h2>
            {/* MENU SECTION */}
            <div className="flex gap-6 mx-4 items-start">
                <div className='w-1/4 border-3 border-red-700 p-4 bg-white rounded-xl shadow-md'>
                    <h2 className='text-red-900 font-bold text-4xl text-center border-b-3 bg-red-50 '>MENU</h2>
                    <Menu menu={menu} />
                </div>
                <div className="w-3/4 grid grid-cols-3 gap-4">
                    {dishes.slice(0, 9).map((dish, index) => (
                        <DishCard key={index} {...dish} />
                    ))}
                </div>
            </div>

            {/* ALL RESTAURANTS OF SAME TYPE */}
            <h2 className='text-red-900 font-bold text-4xl text-center mt-12 mb-6'>Similar Restaurants</h2>
            <div className='grid grid-cols-4 gap-4'>
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

import axios from 'axios';
import React from 'react'
// import dish from "../assets/logo.png"
import { FaHeart, FaRupeeSign, FaShoppingCart, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DishCard = ({ dish_name, dish_image, dish_description, dish_price, dish_rating }) => {

  const USER_ID = localStorage.getItem('user_id');

  const handleWhishList = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/whishlist/insert/${USER_ID}`, {
        dish_img: dish_image,
        dish_name,
        dish_price,
        dish_description
      });
      if (response.status == 201) {
        toast.success("dish add in whishlist");
        return;
      }
    } catch (error) {
      toast.error("dish is not add in whishlist");
      console.error(error);
    }
  }

  const handleCart = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/cart/insert/${USER_ID}`, {
        dish_img: dish_image,
        dish_name,
        dish_price,
        dish_description,
        dish_qty: 1,
      });
      if (response.status == 201) {
        toast.success("dish sussessfully add in cart");
      }
    } catch (error) {
      toast.error("dish is not add in cart!");
      console.error(error);

    }
  }

  return (
    <div className="w-64 rounded-3xl bg-gradient-to-b from-red-200 to-red-100 shadow-xl p-4 relative text-center">
      <div className="relative">
        <img src={dish_image} alt={dish_name} className="rounded-full mx-auto w-40 h-40 object-cover shadow-md" />
        <div className="absolute top-0 -right-3 bg-red-500 text-red-200 hover:bg-red-300 hover:text-red-600 rounded-full p-2"
          onClick={handleCart}>
          <FaShoppingCart className="text-sm h-6 w-6" />
        </div>
        <div className="absolute top-12 -right-3 bg-red-500 text-red-200 hover:bg-red-300 hover:text-red-600 rounded-full p-2"
          onClick={handleWhishList}>
          <FaHeart className="text-sm h-6 w-6" />
        </div>
        <div className="absolute top-24 -right-3 bg-green-700 text-red-200 hover:bg-green-600 hover:text-red-600 rounded-full p-2">
          <FaStar className="text-sm h-6 w-6" />
        </div>
        <p className='absolute top-34 right-0 text-green-700 font-semibold'>{dish_rating}</p>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-red-900">{dish_name}</h3>
        <p className="text-sm text-red-800">{dish_description}</p>
        <div className="mt-2 flex items-center justify-center text-md font-semibold text-red-900">
          <FaRupeeSign className="mr-1 text-sm" />
          {dish_price}
        </div>
      </div>
    </div>
  )
}

export default DishCard
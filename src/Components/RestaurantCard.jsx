import React from 'react'
// import dish from "../assets/logo.png"
import { FaHeart, FaPhone, FaRupeeSign, FaShoppingCart, FaStar } from 'react-icons/fa';
import { FaMapLocation } from 'react-icons/fa6';

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="w-64 rounded-3xl bg-gradient-to-b from-gray-200 to-red-100 shadow-xl p-4 relative text-center ml-7 ">
      <div className="relative">
        <img src={restaurant.res_img} alt={restaurant.res_name} className="rounded-full mx-auto w-40 h-40 object-cover shadow-md" />
        <div className="absolute top-0 -right-3 bg-green-700 text-red-200 hover:bg-red-300 hover:text-red-600 rounded-full p-2">
          <FaStar className="text-sm h-6 w-6" />
        </div>
        <p className='absolute top-10 -right-1 text-green-700 font-semibold'>{restaurant.res_rating}</p>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-red-900">{restaurant.res_name}</h3>
        <div className="mt-2 flex items-center justify-center text-md font-semibold text-red-900">
          {/* <FaMapLocation className="mr-1 text-sm" /> */}
          {restaurant.res_address || restaurant.res_location}
        </div>
        <div className="mt-2 flex items-center justify-center text-md font-semibold text-red-900">
          <FaPhone className="mr-1 text-sm" />
          {restaurant.res_phone}
        </div>
      </div>
    </div>
  )
}

export default RestaurantCard
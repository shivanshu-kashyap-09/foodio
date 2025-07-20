import React from 'react'
import { FaHeart, FaPhone, FaRupeeSign, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RestaurantCard = ({ restaurant, type }) => {
  const navigate = useNavigate();
  const handleRestaurantById = async () => {
    navigate(`/restaurant/${type}/${restaurant.res_name}/${restaurant.res_id}`)
  }
  return (
    <div className="w-full max-w-xs sm:w-64 rounded-3xl bg-gradient-to-b from-gray-200 to-red-100 shadow-xl p-4 relative text-center mx-auto cursor-pointer hover:shadow-2xl transition-shadow" onClick={handleRestaurantById}>
      <div className="relative">
        <img src={restaurant.res_img} alt={restaurant.res_name} className="rounded-full mx-auto w-32 h-32 sm:w-40 sm:h-40 object-cover shadow-md" />
        <div className="absolute -top-2 -right-4 sm:-right-3 bg-green-700 text-red-200 hover:bg-red-300 hover:text-red-600 rounded-full p-2">
          <FaStar className="text-sm h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <p className='absolute top-7 sm:top-10 -right-4 text-green-700 font-semibold text-sm sm:text-base'>{restaurant.res_rating}</p>
      </div>
      <div className="mt-4">
        <h3 className="text-base sm:text-lg font-bold text-red-900">{restaurant.res_name}</h3>
        <div className="mt-2 flex items-center justify-center text-sm sm:text-md font-semibold text-red-900">
          {restaurant.res_address || restaurant.res_location}
        </div>
        <div className="mt-2 flex items-center justify-center text-sm sm:text-md font-semibold text-red-900">
          <FaPhone className="mr-1 text-xs sm:text-sm" />
          {restaurant.res_phone}
        </div>
      </div>
    </div>
  )
}

export default RestaurantCard
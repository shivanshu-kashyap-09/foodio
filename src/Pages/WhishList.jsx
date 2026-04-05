import React, { useState, useEffect } from 'react'
import { FaTrash } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WhishList = () => {
  const [cartItems, setCartItems] = useState([]);
  const USER_ID = localStorage.getItem('user_id');

  const handleWhishList = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/user/wishlist/${USER_ID}/wishlist`);
      if (response.status === 200) {
        setCartItems(response.data.data.items || []);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteWhishList = async (item_id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_URL}/user/wishlist/${USER_ID}/wishlist/remove/${item_id}`);
      if (response.status == 200) {
        handleWhishList();
      }
    } catch (error) {
      toast.error("dish is not removed!");
      console.error(error);
    }
  }

  const handleCart = async (item_id, menu_type) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/user/cart/${USER_ID}/cart/add`, {
        itemId: item_id,
        quantity: 1,
        menuType: menu_type || 'veg',
      });
      if (response.status == 201) {
        toast.success("Dish successfully added to cart");
        handleDeleteWhishList(item_id);
      }
    } catch (error) {
      toast.error("dish is not add in cart!");
      console.error(error);
    }
  }

  useEffect(() => {
    handleWhishList();
  }, []);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
      <h2 className="text-red-900 font-bold text-2xl sm:text-3xl lg:text-4xl mt-12 pt-4 text-center">WHISHLIST</h2>
      {cartItems.length == 0 ? (
        <div className="flex justify-center mt-8">
          <img
            src="https://cdn-icons-png.flaticon.com/512/13637/13637462.png"
            alt="empty wishlist"
            className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 mx-auto"
          />
        </div>
      ) : (
        <div className="mx-auto max-w-full sm:max-w-4xl lg:max-w-5xl rounded-xl bg-red-200 mt-8">
          <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 sm:gap-3 bg-red-400 text-red-900 font-bold px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
            <h2 className="text-center">S.NO.</h2>
            <h2 className="text-center ">IMAGE</h2>
            <h2 className="text-center">DISH NAME</h2>
            <h2 className="text-center">PRICE</h2>
            <h2 className="text-center">ACTION</h2>
          </div>
          {cartItems.map((item, index) => (
            <div key={item.item_id} className="grid grid-cols-5 sm:grid-cols-5 gap-2 sm:gap-3 items-center border-b px-2 sm:px-4 py-2 sm:py-3 bg-white text-xs sm:text-sm">
              <p className="text-center font-bold text-red-700">{index + 1}.</p>
              <img
                src={item.item_image || item.dish_img}
                alt={item.item_name}
                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded object-cover mx-auto"
              />
              <p className="text-gray-800 font-semibold truncate">{item.item_name}</p>
              <p className="text-center text-green-700 font-semibold">₹{item.item_price}</p>
              <div className="flex justify-center gap-1 sm:gap-2">
                <button className="text-green-600 border p-1 sm:p-2 rounded-md hover:bg-green-100" onClick={() => handleCart(item.item_id, item.menu_type)}>
                  <FaCartShopping className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button className="text-red-600 border p-1 sm:p-2 rounded-md hover:bg-red-100" onClick={() => handleDeleteWhishList(item.item_id)}>
                  <FaTrash className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhishList;
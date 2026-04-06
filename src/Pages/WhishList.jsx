import React, { useState, useEffect } from 'react'
import { FaTrash } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WhishList = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const USER_ID = localStorage.getItem('user_id');
  const API = import.meta.env.VITE_URL;

  const getMenuEndpoint = (type, id) => {
    const map = {
      veg: `/menus/${type}/${id}`,
      nonveg: `/menus/${type}/${id}`,
      southindian: `/menus/${type}/${id}`,
      thali: `/${type}/${id}`
    };
    return map[type];
  };

  const handleWhishList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/user/wishlist/${USER_ID}/wishlist`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 200) {
        const items = response.data.data || [];
        
        const cache = {};

        const detailedItems = await Promise.all(
          items.map(async (item) => {
            const dish_id = item.dish_id || item.item_id;
            const dish_type = item.dish_type || item.menu_type || 'veg';

            if (cache[dish_id]) {
              return { ...item, ...cache[dish_id], item_id: dish_id, menu_type: dish_type };
            }

            const endpoint = getMenuEndpoint(dish_type, dish_id);

            if (!endpoint) return { ...item, item_id: dish_id, menu_type: dish_type };

            try {
              const dishRes = await axios.get(`${API}${endpoint}`);
              const dish = dishRes.data.data;

              const formatted = {
                item_name: dish.dish_name || dish.thali_name || dish.name,
                item_price: parseFloat(dish.dish_price || dish.price),
                item_image: dish.dish_image || dish.thali_img || dish.image,
                item_id: dish_id,
                menu_type: dish_type
              };

              cache[dish_id] = formatted;

              return { ...item, ...formatted };

            } catch (err) {
              console.error("Dish fetch error:", dish_id);
              return { ...item, item_id: dish_id, menu_type: dish_type };
            }
          })
        );
        
        setCartItems(detailedItems);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteWhishList = async (item_id) => {
    try {
      const response = await axios.delete(`${API}/user/wishlist/${USER_ID}/wishlist/remove/${item_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
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
      const response = await axios.post(`${API}/user/cart/${USER_ID}/cart/add`, {
        itemId: item_id,
        quantity: 1,
        menuType: menu_type || 'veg',
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
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

  if (loading) {
    return (
      <div className="mt-20 p-6 space-y-4 max-w-5xl mx-auto">
        {[1, 2, 3,4,5,6,7,8,9].map((_, i) => (
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
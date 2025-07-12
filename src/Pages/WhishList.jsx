import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WhishList = () => {
  const [cartItems, setCartItems] = useState([]);

  const handleWhishList = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/whishlist/get/1`);
      console.log(response.data);
      setCartItems(response.data);
    } catch (error) {
      console.error(error);
      
    }
  }

  const handleDeleteWhishList = async (dish_name) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_URL}/whishlist/delete/1`,{
        data: { dish_name }
      });
      if(response.status == 200){
        toast.success("dish remove successfully");
        console.log("done");
        handleWhishList();
      }
    } catch (error) {
      toast.error("dish is not removed!");
      console.error(error);
      
    }
  }

  const handleCart = async (dish_image, dish_name, dish_price, dish_description) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/cart/insert/1`, {
        dish_img: dish_image,
        dish_name,
        dish_price,
        dish_description,
        dish_qty: 1,
      });
      if (response.status == 201) {
        toast.success("dish sussessfully add in cart");
        handleDeleteWhishList(dish_name);
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
    <div className="py-8 px-4">
      <h2 className='text-red-900 font-bold text-4xl mt-14 pt-5 text-center'>WHISHLIST</h2>

      <div className="mx-10 rounded-xl bg-red-200 mt-10">
        <div className='grid grid-cols-5 gap-3 bg-red-400 text-red-900 font-bold px-4 py-3'>
          <h2 className='ml-20'>S.NO.</h2>
          <h2>IMAGE</h2>
          <h2>DISH NAME</h2>
          <h2 className='ml-10'>PRICE</h2>
          <h2>ACTION</h2>
        </div>

        {/* Items */}
        {cartItems.map((item, index) => (
          <div key={item.id} className="grid grid-cols-5 gap-3 items-center border-b px-4 py-4 bg-white">
            <p className='text-center w-10 ml-20 font-bold text-2xl text-red-700'>{index + 1}.</p>
            <img
              src={item.dish_img}
              alt={item.dish_name}
              className="w-20 h-20 rounded object-cover"
            />
            <div>
              {/* <h3 className="text-lg font-medium">{item.restaurant}</h3> */}
              {/* <p className="text-gray-500">{item.location}</p> */}
              <p className="mt-1 text-gray-800 font-semibold">{item.dish_name}</p>
            </div>
            <p className="text-green-700 font-semibold text-lg ml-10">₹{item.dish_price}</p>
            <div className="flex gap-2">
              <button className="text-green-600 border px-3 py-2 rounded-md">
                <FaCartShopping className='h-5 w-5' onClick={() => {handleCart(item.dish_img, item.dish_name, item.dish_price, item.dish_description)}}/>
              </button>
              <button className="text-red-600 border px-3 py-2 rounded-md"
              onClick={() => handleDeleteWhishList(item.dish_name)}>
                <FaTrash className='h-5 w-5' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhishList;

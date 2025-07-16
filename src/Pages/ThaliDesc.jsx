import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ThaliDesc = () => {
  const { thali_id } = useParams();
  const [thali, setThali] = useState([]);
  const [dish, setDish] = useState([]);

  // Fetch thali details
  const handleThali = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/thali/get/id/${thali_id}`);
      if (response.status === 200) {
        setThali(response.data);
      }
    } catch (error) {
      console.error("Error fetching thali:", error);
    }
  };

  // Fetch thali dishes
  const handleDish = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/thalidish/thali/${thali_id}`);
      if (response.status === 200) {
        setDish(response.data);
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  // Add to cart
  const handleCart = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/cart/insert/1`, {
        dish_img: thali.thali_img,
        dish_name: thali.thali_name,
        dish_price: thali.price,
        dish_description: thali.description,
        dish_qty: 1
      });

      if (response.status === 201) {
        toast.success("Thali successfully added to cart!");
      }
    } catch (error) {
      toast.error("Failed to add thali to cart!");
      console.error(error);
    }
  };

  // Load thali + dishes on mount
  useEffect(() => {
    handleThali();
    handleDish();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 mt-10">
      {/* Image and Info Side by Side */}
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Thali Image */}
        <div className="md:w-1/2 w-full">
          <img
            src={thali.thali_img}
            alt={thali.thali_name}
            className="rounded-xl w-full shadow-lg h-100"
          />
        </div>

        {/* Thali Info */}
        <div className="md:w-1/2 w-full space-y-3">
          <h2 className="text-3xl font-bold text-red-900">{thali.thali_name}</h2>
          <p className="text-gray-700">{thali.description || "Delicious Indian Veg Thali packed with flavors!"}</p>
          <p className="text-xl font-semibold text-green-700">Price: ₹{thali.price}</p>
          <p className="text-yellow-600 font-medium">Rating: ⭐ {thali.rating || '4.5'}</p>
          <p className="text-gray-800 font-semibold">Restaurant: {thali.restaurant_name || 'N/A'}</p>
        </div>
      </div>

      {/* Thali Dishes Table */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-red-800 mb-4 text-center">Thali Dishes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-center border border-gray-300">
            <thead className="bg-red-100 text-red-800">
              <tr>
                <th className="border px-4 py-2">S.No</th>
                <th className="border px-4 py-2">Dish Name</th>
                <th className="border px-4 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {dish.length > 0 ? (
                dish.map((d, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{d.dish_name}</td>
                    <td className="border px-4 py-2">{d.qty || 1}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border px-4 py-2 text-gray-500">No dishes listed</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="flex justify-center mt-8">
        <button
          className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition disabled:opacity-50"
          onClick={handleCart}
          disabled={!thali.thali_name}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ThaliDesc;

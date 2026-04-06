import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaStar, FaLeaf, FaChevronLeft, FaCheckCircle } from 'react-icons/fa';

const ThaliDesc = () => {
  const { thali_id } = useParams();
  const [thali, setThali] = useState({});
  const [dish, setDish] = useState([]);

  const USER_ID = localStorage.getItem('user_id');

  const handleThali = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/thali/${thali_id}`);
      if (response.status === 200) {
        setThali(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching thali:", error);
    }
  };

  const handleDish = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/thali/${thali_id}/dishes`);
      if (response.status === 200) {
        setDish(response.data.data.dishes || []);
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  const handleCart = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/user/cart/${USER_ID}/cart/add`,{
        itemId: thali_id,
        quantity: 1,
        menuType: 'thali'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201) {
        toast.success("Thali successfully added to feast!");
      }
    } catch (error) {
      toast.error("Failed to add thali to cart!");
      console.error(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    handleThali();
    handleDish();
  }, [thali_id]);

  if (!thali.thali_name) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-gray-50/50">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin shadow-xl"></div>
        <p className="mt-4 text-red-600 font-bold animate-pulse">Preparing your platter...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-20 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Back navigation */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold text-sm mb-8 transition-colors group">
           <div className="bg-white p-2 text-xs rounded-full shadow-sm group-hover:shadow-md transition-all">
             <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
           </div>
           Back to Menu
        </Link>
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-stretch mb-16 bg-white p-6 sm:p-10 rounded-[3rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100">
          
          {/* Left: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-1/2 flex items-center justify-center relative"
          >
            {/* Background Blob */}
            <div className="absolute inset-0 bg-red-50/80 rounded-full blur-3xl scale-90 -z-10"></div>
            
            <motion.div 
               className="relative w-full max-w-[450px] aspect-square rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border-8 border-white"
               whileHover={{ scale: 1.02 }}
            >
              <img
                src={thali.thali_img}
                alt={thali.thali_name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Tag */}
            <div className="absolute top-4 left-4 sm:top-10 sm:left-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg border border-gray-100">
               <FaLeaf className="text-green-500" />
               <span className="text-xs font-black uppercase text-gray-800 tracking-wider">100% Veg</span>
            </div>
          </motion.div>

          {/* Right: Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-2 text-yellow-400 mb-3 bg-yellow-50 w-fit px-3 py-1 rounded-full border border-yellow-100">
                {[...Array(5)].map((_, i) => <FaStar key={i} className="text-sm" />)}
                <span className="text-xs font-black text-yellow-600 ml-1">{thali.rating || '4.8'}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                {thali.thali_name}
              </h1>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                {thali.description || "A grand symphony of authentic Indian flavors, thoughtfully curated into one spectacular platter. Served fresh and piping hot."}
              </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
               className="py-6 border-y border-gray-100 flex items-center justify-between"
            >
              <div>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Price</p>
                 <div className="text-4xl font-black text-red-600">₹{thali.price}</div>
              </div>
              <div className="text-right">
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Restaurant</p>
                 <div className="text-lg font-bold text-gray-800">{thali.restaurant_name || 'Foodio Exclusives'}</div>
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="group relative w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-5 rounded-2xl transition-all shadow-lg shadow-red-200 overflow-hidden"
              onClick={handleCart}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <FaShoppingCart className="text-xl relative z-10" />
              <span className="text-lg font-bold relative z-10">Add Thali to Feast</span>
            </motion.button>
          </div>
        </div>

        {/* Dishes Breakdown Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-gray-100"
        >
          <div className="mb-10 text-center">
             <h3 className="text-3xl font-black text-gray-900 tracking-tight">What's Inside The Thali</h3>
             <div className="h-1 w-16 bg-red-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {dish.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dish.map((d, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 bg-gray-50/80 hover:bg-red-50/50 p-4 rounded-2xl border border-gray-100 hover:border-red-100 transition-colors group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <FaCheckCircle className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-gray-800 group-hover:text-red-900 transition-colors uppercase tracking-wide">{d.dish_name}</h4>
                    <span className="text-xs font-semibold text-gray-400">Qty: {d.qty || 1}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                 <FaLeaf className="text-2xl" />
               </div>
               <p className="text-gray-500 font-medium">Ingredients are kept a delicious secret.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ThaliDesc;

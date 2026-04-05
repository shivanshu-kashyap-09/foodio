import axios from 'axios';
import React from 'react'
import { motion } from 'framer-motion';
import { FaHeart, FaRupeeSign, FaShoppingCart, FaStar, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import EditDishModal from '../modals/EdiitDishModal';

const DishCard = ({ 
  restaurant_id, 
  res_id,
  dish_id, 
  dish_name, 
  dish_image, 
  dish_img,
  dish_description, 
  dish_desc,
  dish_price, 
  dish_rating,
  menuType = 'veg'
}) => {
  const final_dish_image = dish_image || dish_img;
  const final_dish_description = dish_description || dish_desc;
  const final_res_id = restaurant_id || res_id;
  const final_dish_id = dish_id;
  
  const USER_ID = localStorage.getItem('user_id');
  const USER_ROLE = localStorage.getItem('role');
  const [showModal, setShowModal] = React.useState(false);

  const handleWhishList = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/user/wishlist/${USER_ID}/wishlist/add`, {
        itemId: final_dish_id,
        menuType
      });
      if (response.status == 201) {
        toast.success("Dish added to wishlist");
        return;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Dish is already in wishlist or failed to add");
      console.error(error);
    }
  }

  const handleCart = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/user/cart/${USER_ID}/cart/add`, {
        itemId: final_dish_id,
        quantity: 1,
        menuType,
      });
      if (response.status == 201) {
        toast.success("Dish successfully added to cart");
      }
    } catch (error) {
      toast.error("Failed to add dish to cart!");
      console.error(error);
    }
  }

  const handleEdit = async () => {
    if (USER_ROLE !== "ADMIN") {
      toast.error("Only admin can edit dishes");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_URL}/dish/edit/${dish_id}`,
        {
          dish_name,
          dish_image,
          dish_description,
          dish_price,
          dish_rating
        }
      );

      if (response.status === 200) {
        toast.success("Dish updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update dish");
    }
  };


  const cardVariants = {
    rest: {
      scale: 1,
      y: 0
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    },
    tap: { scale: 0.95 }
  };

  return (

    <motion.div
      className="w-full max-w-xs sm:w-64 rounded-2xl bg-gradient-to-br from-red-50 via-white to-red-50 shadow-lg hover:shadow-xl p-6 relative text-center mx-auto border border-red-200"
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      {USER_ROLE === "ADMIN" && (
        <motion.div
          className="absolute top-2 left-2 bg-blue-600 text-white 
               hover:bg-blue-500 rounded-full p-2 cursor-pointer z-10"
          onClick={() => setShowModal(true)}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaEdit className="h-4 w-4 sm:h-5 sm:w-5" />
        </motion.div>
      )}

      <div className="relative">
        <motion.img
          src={final_dish_image}
          alt={dish_name}
          className="rounded-full mx-auto w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover shadow-md"
          variants={imageVariants}
        />
        <motion.div
          className="absolute top-0 -right-2 sm:-right-4 bg-red-500 text-red-200 hover:bg-red-300 hover:text-red-600 rounded-full p-2 cursor-pointer"
          onClick={handleCart}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaShoppingCart className="text-xs sm:text-sm h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
        </motion.div>
        <motion.div
          className="absolute top-8 sm:top-11 -right-2 sm:-right-4 bg-red-500 text-red-200 hover:bg-red-300 hover:text-red-600 rounded-full p-2 cursor-pointer"
          onClick={handleWhishList}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaHeart className="text-xs sm:text-sm h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
        </motion.div>
        <motion.div
          className="absolute top-16 sm:top-10 lg:top-22 -right-2 sm:-right-4 bg-green-700 text-red-200 hover:bg-green-600 hover:text-red-600 rounded-full p-2"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <FaStar className="text-xs sm:text-sm h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
        </motion.div>
        <motion.p
          className='absolute top-24 sm:top-20 lg:top-32 -right-1 text-green-700 font-semibold text-xs sm:text-sm'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {dish_rating}
        </motion.p>
      </div>
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-base sm:text-lg font-bold text-red-900 truncate">{dish_name}</h3>
        <p className="text-xs sm:text-sm text-red-800 line-clamp-2">{final_dish_description}</p>
        <motion.div
          className="mt-2 flex items-center justify-center text-sm sm:text-md font-semibold text-red-900"
          whileHover={{ scale: 1.1 }}
        >
          <FaRupeeSign className="mr-1 text-xs sm:text-sm" />
          {dish_price}
        </motion.div>
      </motion.div>
      {showModal && (
        <EditDishModal
        restaurantId={restaurant_id}
          dishId={dish_id}
          currentName={dish_name}
          currentImage={dish_image}
          currentDescription={dish_description}
          currentPrice={dish_price}
          currentRating={dish_rating}
          onClose={() => setShowModal(false)}
          onSave={async (updatedDish) => {
            try {
              const res = await axios.put(
                `${import.meta.env.VITE_URL}/vegmenu/restaurant/${final_res_id}/update/${dish_id}`,
                updatedDish
              );

              if (res.status === 200) {
                toast.success("Dish updated successfully");
                setShowModal(false);
              }
            } catch (err) {
              toast.error("Failed to update dish");
            }
          }}
        />
      )}

    </motion.div>
  )
}

export default DishCard
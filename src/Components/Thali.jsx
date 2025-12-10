import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

const Thali = ({thalis}) => {
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 500,
    arrows: false,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const handleThali = (thaliId) => {
    navigate(`/thali/description/${thaliId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const titleVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="w-full py-8 sm:py-10 md:py-12 bg-white"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-center text-red-900"
          variants={titleVariants}
        >
          Indian Veg Thalis
        </motion.h2>
        <Slider {...settings}>
          {thalis.map((thali, index) => (
            <div key={index} className="px-1 sm:px-2">
              <motion.div 
                className="bg-white rounded-xl text-center h-80 sm:h-92 shadow-lg hover:shadow-xl overflow-hidden mx-auto max-w-xs sm:max-w-sm transform transition-all duration-300"
                onClick={() => handleThali(thali.thali_id)}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.img
                  src={thali.thali_img}
                  alt={thali.thali_name}
                  className="h-56 sm:h-64 md:h-72 w-56 sm:w-64 md:w-72 rounded-full mt-1 mx-auto"
                  whileHover={{ 
                    rotate: [0, -5, 5, -5, 0],
                    transition: { duration: 0.5 }
                  }}
                />
                <motion.div 
                  className="p-3 sm:p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-base sm:text-lg text-red-900 font-bold">{thali.thali_name}</h3>
                  <p className="text-sm sm:text-base text-red-600 font-bold">{thali.price}</p>
                </motion.div>
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>
    </motion.div>
  );
};

export default Thali;
import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import { FaLeaf, FaChevronRight, FaStar } from 'react-icons/fa';

const Thali = ({ thalis }) => {
  const navigate = useNavigate();

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
    cssEase: "cubic-bezier(0.87, 0, 0.13, 1)",
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, centerMode: true, centerPadding: '40px' },
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
      transition: { duration: 0.8, staggerChildren: 0.15 }
    }
  };

  const titleVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  return (
    <div className="relative py-20 bg-gradient-to-br from-orange-50/50 via-white to-red-50/50 overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="flex flex-col items-center justify-center text-center mb-16"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-[2px] w-8 bg-red-600"></div>
            <span className="text-red-500 font-extrabold text-[10px] uppercase tracking-[0.25em]">Ultimate Feast</span>
            <div className="h-[2px] w-8 bg-red-600"></div>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tighter shadow-sm mb-4">
            ROYAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 italic">THALIS</span>
          </h2>
          <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl">
            A grand tapestry of regional flavors served on a single platter. Handcrafted for the ultimate dining experience.
          </p>
        </motion.div>

        {/* Carousel Section */}
        <motion.div
           variants={containerVariants}
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-50px" }}
           className="relative"
        >
          {Array.isArray(thalis) && thalis.length > 0 ? (
            <Slider {...settings} className="thali-slider pb-10">
              {thalis.map((thali, index) => (
                <div key={index} className="px-3 md:px-4 pb-12 pt-4">
                  <motion.div 
                    className="relative bg-white rounded-[2.5rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(239,68,68,0.15)] border border-gray-100 hover:border-red-100 transition-all duration-500 group cursor-pointer h-full flex flex-col"
                    onClick={() => handleThali(thali.thali_id)}
                    variants={cardVariants}
                  >
                    {/* Badge */}
                    <div className="absolute top-6 left-6 z-20 flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-200 backdrop-blur-md shadow-sm">
                      <FaLeaf /> 100% Veg
                    </div>

                    {/* Image Container */}
                    <div className="w-full aspect-square relative mb-6 mt-14 pt-2">
                       <motion.div 
                          className="w-full h-full rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.15)] overflow-hidden"
                       >
                         <motion.img
                            src={thali.thali_img}
                            alt={thali.thali_name}
                            className="w-full h-full object-cover origin-center"
                            whileHover={{ rotate: 90 }}
                            transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                         />
                       </motion.div>
                       
                       {/* Floating Shadow effect */}
                       <div className="w-[70%] h-6 bg-black/10 blur-xl rounded-[100%] mx-auto mt-6"></div>
                    </div>

                    {/* Content Section */}
                    <div className="text-center flex flex-col flex-grow items-center justify-end">
                      <div className="flex items-center gap-1 text-orange-400 mb-2">
                         {[1, 2, 3, 4, 5].map(star => <FaStar key={star} className="text-xs" />)}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                        {thali.thali_name}
                      </h3>
                      
                      <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                      <div className="flex items-center justify-between w-full mt-auto">
                        <div className="flex flex-col items-start">
                           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Price</span>
                           <span className="text-2xl font-black text-red-600">₹{thali.price}</span>
                        </div>
                        
                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                          <FaChevronRight className="translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </Slider>
          ) : (
            null
          )}
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .thali-slider .slick-list { overflow: visible; }
        .thali-slider .slick-track { display: flex; align-items: stretch; }
        .thali-slider .slick-slide { height: auto; display: flex; justify-content: center; }
        .thali-slider .slick-slide > div { width: 100%; height: 100%; padding: 10px; }
      `}} />
    </div>
  );
};

export default Thali;
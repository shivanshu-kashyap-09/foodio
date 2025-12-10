import React from 'react';
import { motion } from 'framer-motion';

const Banner = () => {
  const bannerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className='mx-4 sm:mx-6 md:mx-8 lg:mx-12 my-4'
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={bannerVariants}
    >
      <motion.img 
        src="https://b.zmtcdn.com/data/o2_assets/e067a1cf0d3fe27b366402b98b994e9f1716296909.png" 
        alt="Banner" 
        className="w-full h-auto object-cover rounded-xl shadow-lg" 
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default Banner;
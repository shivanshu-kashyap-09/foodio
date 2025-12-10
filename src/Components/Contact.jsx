import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Contact = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const socialIconVariants = {
    hover: {
      scale: 1.2,
      rotate: 15,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#eae6f7] px-4 sm:px-6 md:px-8 py-8 sm:py-10 flex flex-col md:flex-row justify-between items-start relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <motion.div 
        className="w-full md:w-1/3 space-y-4 sm:space-y-6 text-red-900 z-10 ml-10"
        variants={itemVariants}
      >
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center md:text-left"
          variants={itemVariants}
        >
          Customer Support
        </motion.h2>
        <motion.p 
          className="text-sm sm:text-base md:text-lg text-center md:text-left"
          variants={itemVariants}
        >
          Email:{' '}
          <motion.a 
            href="mailto:support@gmail.com" 
            className="text-orange-600 font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            support@gmail.com
          </motion.a>
        </motion.p>
        <motion.div variants={itemVariants}>
          <motion.h3 
            className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-center md:text-left"
            variants={itemVariants}
          >
            Find us on
          </motion.h3>
        </motion.div>
        <motion.div 
          className="flex justify-center md:justify-start"
          variants={itemVariants}
        >
          <div className='flex gap-2 sm:gap-3'>
            <motion.a 
              className="text-red-900 py-2 sm:py-3 px-2" 
              href="/#"
              whileHover="hover"
              variants={socialIconVariants}
            >
              <FaFacebook className='size-6 sm:size-7 md:size-8 hover:text-red-400'/>
            </motion.a>
            <motion.a 
              className="text-red-900 py-2 sm:py-3 px-2" 
              href="/#"
              whileHover="hover"
              variants={socialIconVariants}
            >
              <FaInstagram className='size-6 sm:size-7 md:size-8 hover:text-red-400'/>
            </motion.a>
            <motion.a 
              className="text-red-900 py-2 sm:py-3 px-2" 
              href="/#"
              whileHover="hover"
              variants={socialIconVariants}
            >
              <FaTwitter className='size-6 sm:size-7 md:size-8 hover:text-red-400'/>
            </motion.a>
            <motion.a 
              className="text-red-900 py-2 sm:py-3 px-2" 
              href="/#"
              whileHover="hover"
              variants={socialIconVariants}
            >
              <FaYoutube className='size-6 sm:size-7 md:size-8 hover:text-red-400'/>
            </motion.a>
          </div>
        </motion.div>
        <motion.div 
          className="text-center md:text-left"
          variants={itemVariants}
        >
          <motion.a
            href="https://www.google.com/maps/dir/?api=1&destination=india"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 bg-orange-600 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full font-semibold hover:bg-orange-700 transition text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Directions
          </motion.a>
        </motion.div>
        <motion.div 
          className="hidden md:flex justify-center md:justify-start"
          variants={itemVariants}
        >
          <motion.img
            src="https://www.swiggy.com/corporate/wp-content/uploads/2024/10/yoga-day-2.webp"
            alt="Decoration"
            className="w-32 h-32 sm:w-36 sm:h-36 md:w-42 md:h-42"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />
        </motion.div>
      </motion.div>

      <motion.div 
        className="w-full md:w-[45%] bg-white shadow-xl rounded-2xl p-6 sm:p-8 mt-8 md:mt-0 relative z-10 mr-15"
        variants={itemVariants}
      >
        <motion.h3 
          className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-red-900 text-center md:text-left"
          variants={itemVariants}
        >
          Get in touch
        </motion.h3>
        <motion.div 
          className="space-y-4"
          variants={itemVariants}
        >
          <motion.input
            type="text"
            placeholder="Enter Name"
            required
            className="w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <motion.input
            type="email"
            placeholder="Enter Email Address"
            required
            className="w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <motion.textarea
            placeholder="Enter Message"
            rows="5"
            required
            className="w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <motion.button
            type="button"
            className="bg-orange-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-md hover:bg-orange-700 transition text-sm sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit
          </motion.button>
        </motion.div>
        <motion.p 
          className="text-xs sm:text-sm mt-4 text-center md:text-left"
          variants={itemVariants}
        >
          By contacting us you agree to the{' '}
          <motion.a 
            href="#" 
            className="text-orange-600 font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            Terms and Conditions
          </motion.a>{' '}
          and{' '}
          <motion.a 
            href="#" 
            className="text-orange-600 font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            Privacy Policy
          </motion.a>
        </motion.p>
        <motion.img
          src="https://www.swiggy.com/corporate/wp-content/uploads/2024/10/Sandwich-1-796x1024.webp"
          alt="Sandwich"
          className="absolute top-[-20px] right-[-20px] w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Contact;
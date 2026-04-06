import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Choose = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <motion.div 
      className="relative w-full px-4 sm:px-6 md:px-8 py-20 lg:py-32 bg-gradient-to-br from-red-50/50 via-white to-red-50 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Decorative Blob */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-200/40 rounded-full blur-[100px] -z-10 absolute pointer-events-none"></div>

      <div className="max-w-7xl mx-auto z-10 relative">
        <motion.div variants={itemVariants} className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="w-full lg:w-[45%] space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-3">
               <div className="h-1 w-10 bg-red-600 rounded-full"></div>
               <span className="text-red-600 font-extrabold text-[10px] uppercase tracking-[0.3em]">Our Mission</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Championing <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 italic">Local Tastes</span>
            </h2>
            
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-medium">
              Restaurants sit at the heart of our communities. It’s our mission to strengthen their roots, deepen their connections, and multiply the positive impact they have on our society through every meal delivered.
            </p>
            
            <div className="pt-4">
              <Link
                to="/restaurant"
                className="inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-[0_10px_20px_rgba(220,38,38,0.2)] hover:shadow-[0_15px_30px_rgba(220,38,38,0.3)] transform hover:-translate-y-1"
              >
                Discover Top Restaurants
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </div>

          {/* Hero Image Group */}
          <motion.div variants={itemVariants} className="w-full lg:w-[55%] flex justify-center relative group">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700"></div>
            <motion.div
               whileHover={{ scale: 1.02, rotate: 2 }}
               transition={{ type: "spring", stiffness: 300 }}
               className="relative z-10"
            >
               <img
                 src="https://about.grubhub.com/wp-content/uploads/2025/06/header-about_721x756_v2c.png"
                 alt="Restaurants Impact"
                 className="w-full max-w-[500px] object-contain drop-shadow-2xl"
               />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <div className="mt-24 sm:mt-32 relative">
          <svg className="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 -z-10 opacity-30 text-red-200" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray="10 10" />
          </svg>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-6 relative z-10 pt-4">
            
            {/* Stat 1 */}
            <motion.div variants={itemVariants} whileHover={{ y: -10 }} className="flex flex-col items-center text-center group bg-white/60 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white shadow-xl hover:shadow-2xl transition-all">
              <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-200 mb-6 group-hover:scale-110 transition-transform -rotate-6 group-hover:rotate-0">
                <img src="https://about.grubhub.com/wp-content/uploads/2025/06/circle-3_156x156c_v2.png" alt="Food" className="w-16 h-16 object-contain filter invert" />
              </div>
              <p className="text-4xl font-black text-gray-900 tracking-tight">8k<span className="text-red-500">+</span></p>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 px-4">Pounds of Food Recovered</p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div variants={itemVariants} whileHover={{ y: -10 }} className="flex flex-col items-center text-center group bg-white/60 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white shadow-xl hover:shadow-2xl transition-all">
              <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-200 mb-6 group-hover:scale-110 transition-transform rotate-3 group-hover:rotate-0">
                <img src="https://about.grubhub.com/wp-content/uploads/2025/06/circle-2-1_156x156c_v2.png" alt="Meals" className="w-16 h-16 object-contain filter invert" />
              </div>
              <p className="text-4xl font-black text-gray-900 tracking-tight">12k<span className="text-red-500">+</span></p>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 px-4">Happy Meals Provided</p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div variants={itemVariants} whileHover={{ y: -10 }} className="flex flex-col items-center text-center group bg-white/60 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white shadow-xl hover:shadow-2xl transition-all">
              <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-200 mb-6 group-hover:scale-110 transition-transform -rotate-3 group-hover:rotate-0">
                <img src="https://about.grubhub.com/wp-content/uploads/2025/06/circle-1_156x156c_v2.png" alt="Grants" className="w-16 h-16 object-contain filter invert" />
              </div>
              <p className="text-4xl font-black text-gray-900 tracking-tight">300<span className="text-red-500">+</span></p>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 px-4">Local Restaurant Grants</p>
            </motion.div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Choose;
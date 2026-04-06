import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFire, FaCheck } from 'react-icons/fa';

const Menu = ({ menu = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });

  const filteredMenu = menu.filter((dish) => 
    (dish.dish_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="w-full flex flex-col pt-4">
      {/* Search Output Section */}
      <div className="relative mb-6 sticky top-0 z-10 bg-white">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-red-300">
          <FaSearch className="text-sm" />
        </div>
        <input
          type="text"
          className="w-full pl-11 pr-4 py-3.5 bg-red-50/30 border border-red-100 rounded-2xl text-sm font-bold text-gray-800 placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 focus:bg-white transition-all shadow-inner"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Internal Menu Items Container */}
      <motion.div 
        ref={containerRef}
        className="overflow-y-auto max-h-[500px] custom-scrollbar pr-2 space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <AnimatePresence>
          {filteredMenu.length > 0 ? (
            filteredMenu.map((dish, index) => (
              <motion.div
                key={dish.dish_id || index}
                layout
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="group relative flex items-center justify-between p-4 bg-white hover:bg-gradient-to-r hover:from-white hover:to-red-50 rounded-[1.2rem] border border-gray-100 hover:border-red-200 transition-all cursor-pointer shadow-sm hover:shadow-md overflow-hidden"
              >
                {/* Red indicator bar on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex-1 min-w-0 pr-4 z-10">
                  <h3 className="text-sm sm:text-base font-bold text-gray-800 truncate group-hover:text-red-900 transition-colors">
                    {dish.dish_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 flex items-center gap-1 group-hover:text-orange-500 transition-colors">
                      <FaFire className="text-orange-400" /> Signature
                    </span>
                    {dish.dish_type && (
                       <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold uppercase ${dish.dish_type === 'veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                         {dish.dish_type}
                       </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 z-10">
                  <div className="bg-red-50 group-hover:bg-red-600 transition-colors px-3 py-1.5 rounded-xl border border-red-100 group-hover:border-red-600">
                     <span className="text-sm sm:text-base font-black text-red-600 group-hover:text-white transition-colors">
                       ₹{dish.dish_price}
                     </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-400 text-xl">
                 <FaSearch />
              </div>
              <p className="text-sm text-gray-500 font-bold">No dishes found</p>
              <p className="text-xs text-gray-400 font-medium mt-1">Try another keyword</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Menu;
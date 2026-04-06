import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaCity, FaRoute, FaChevronDown } from 'react-icons/fa';

const Hero = () => {
  const statsData = [
    {
      number: "300+",
      label: "partners",
      icon: <FaUsers className="text-red-500" />,
    },
    {
      number: "100+",
      label: "cities",
      icon: <FaCity className="text-blue-500" />,
    },
    {
      number: "50k+",
      label: "delightful orders",
      icon: <FaRoute className="text-green-500" />,
    },
  ];

  return (
    <section className="relative h-[95vh] sm:h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <motion.video
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2 }}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="https://b.zmtcdn.com/data/file_assets/2627bbed9d6c068e50d2aadcca11ddbb1743095925.mp4"
            type="video/mp4"
          />
        </motion.video>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-transparent to-gray-900/40"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-[-5vh]">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
   
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.85] mb-8">
            CRAVINGS <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">EVOLVED.</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Experience the next generation of food delivery. Powered by AI, delivered by experts, enjoyed by you.
          </p>
        </motion.div>

        {/* Floating Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="hidden md:flex bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-2 max-w-4xl mx-auto items-center justify-between shadow-2xl"
        >
          {statsData.map((stat, index) => (
            <React.Fragment key={index}>
              <div className="flex-1 flex items-center justify-center gap-6 py-6 px-4 hover:bg-white/5 transition-all rounded-[2.5rem] group">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-left">
                  <div className="text-2xl font-black text-white leading-none">{stat.number}</div>
                  <div className="text-[10px] font-black text-red-100 uppercase tracking-widest mt-1 opacity-60">{stat.label}</div>
                </div>
              </div>
              {index < statsData.length - 1 && (
                <div className="h-12 w-px bg-white/10"></div>
              )}
            </React.Fragment>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
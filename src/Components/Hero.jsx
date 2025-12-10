import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  };

  const statsData = [
    {
      number: "300+",
      label: "restaurants",
      icon: "https://b.zmtcdn.com/data/o2_assets/d19ec60986487a77bcb026e5efc3325f1742908200.png",
    },
    {
      number: "100+",
      label: "cities",
      icon: "https://b.zmtcdn.com/data/o2_assets/e7533c4081d6140da37b9f430cb7b8051743006192.png",
    },
    {
      number: "5000+",
      label: "orders delivered",
      icon: "https://b.zmtcdn.com/data/o2_assets/713443cc5944ce4284d7e49e75e2aacf1742466222.png",
    },
  ];

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative h-screen flex items-center justify-center text-white w-full"
    >
      <motion.video
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://b.zmtcdn.com/data/file_assets/2627bbed9d6c068e50d2aadcca11ddbb1743095925.mp4"
          type="video/mp4"
          media="(min-width: 768px)"
        />
        <source
          src="https://b.zmtcdn.com/data/file_assets/2627bbed9d6c068e50d2aadcca11ddbb1743095925.mp4"
          type="video/mp4"
          media="(max-width: 767px)"
        />
      </motion.video>

      <motion.div 
        className="relative text-center p-4 sm:p-6 md:p-8 rounded-lg max-w-[90%] sm:max-w-[80%] md:max-w-3xl lg:max-w-4xl"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.h2 
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Your city's flavors,
          </motion.span>{" "}
          <br />
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            now just a click away.
          </motion.span>
        </motion.h2>

        <motion.div 
          className="z-50 bg-white mx-auto flex flex-row sm:flex-row w-fit max-w-screen-lg items-center justify-center gap-4 sm:gap-8 rounded-2xl border px-4 py-3 shadow-lg mt-6 sm:mt-8 md:mt-10 lg:rounded-[32px] lg:px-7 lg:py-6 2xl:gap-12 2xl:mt-14"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          whileHover={{ scale: 1.02 }}
        >
          {statsData.map((stat, index) => (
            <React.Fragment key={stat.label}>
              <motion.div 
                className="sm:flex sm:items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.8 + index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div>
                  <motion.div 
                    className="text-2xl font-bold text-gray-800 lg:text-3xl 2xl:text-4xl"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 2 + index * 0.2 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-gray-600 md:text-base lg:text-lg">
                    {stat.label}
                  </div>
                </div>
                <motion.img
                  src={stat.icon}
                  alt={`${stat.label} icon`}
                  className="ml-4 max-h-10 lg:max-h-14 2xl:ml-8"
                  whileHover={{ rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                />
              </motion.div>
              {index < statsData.length - 1 && (
                <div className="hidden sm:block h-9 lg:h-12 xl:h-16 w-px border-l border-gray-300"></div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Hero;
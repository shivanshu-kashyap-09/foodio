import React from 'react';
import { Link } from 'react-router-dom';

const Choose = () => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 bg-white mt-4 sm:mt-5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10 max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto">
        <div className="w-full md:w-1/2 space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-red-900 text-center md:text-left">
            We Champion Restaurants from Coast to Coast
          </h2>
          <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed text-center md:text-left">
            Restaurants sit at the heart of communities. It’s our mission to strengthen their roots, deepen their
            connections, and increase the positive impact they have on people and society.
          </p>
          <div className="text-center md:text-left">
            <Link
              to="/restaurant"
              target="_self"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-md transition duration-300 text-sm sm:text-base"
            >
              VIEW OUR RESTAURANT
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center bg-transparent mt-6 md:mt-0">
          <img
            src="https://about.grubhub.com/wp-content/uploads/2025/06/header-about_721x756_v2c.png"
            alt="Restaurants Impact"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow-md bg-transparent"
          />
        </div>
      </div>

      <div className="relative max-w-full mx-auto mt-12 sm:mt-16 md:mt-20 px-4 sm:px-6 md:px-8">
        <svg
          className="absolute inset-0 w-full h-24 sm:h-28 md:h-36 lg:h-40"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60"
            fill="transparent"
            stroke="#f59e0b"
            strokeWidth="6"
          />
        </svg>

        <div className="relative z-10 flex flex-row sm:flex-row items-center justify-around gap-6 sm:gap-8 md:gap-10 mt-8 sm:mt-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
              <img
                src="https://about.grubhub.com/wp-content/uploads/2025/06/circle-3_156x156c_v2.png"
                alt="Food"
                className="w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26"
              />
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black mt-3 sm:mt-4">8k+</p>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">POUNDS OF FOOD RECOVERED</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
              <img
                src="https://about.grubhub.com/wp-content/uploads/2025/06/circle-2-1_156x156c_v2.png"
                alt="Meals"
                className="w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26"
              />
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black mt-3 sm:mt-4">12k+</p>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">MEALS PROVIDED</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
              <img
                src="https://about.grubhub.com/wp-content/uploads/2025/06/circle-1_156x156c_v2.png"
                alt="Grants"
                className="w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26"
              />
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black mt-3 sm:mt-4">300+</p>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">GRANTS TO INDEPENDENT RESTAURANTS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choose;
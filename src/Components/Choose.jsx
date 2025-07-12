import React from 'react';

const Choose = () => {
  return (
    <div className="w-full px-6 py-12 bg-white mt-5">
      {/* Intro Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 max-w-7xl mx-auto">
        <div className="md:w-1/2 space-y-6 ml-15">
          <h2 className="text-3xl md:text-4xl font-bold text-red-900">
            We Champion Restaurants from Coast to Coast
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Restaurants sit at the heart of communities. It’s our mission to strengthen their roots, deepen their
            connections, and increase the positive impact they have on people and society.
          </p>
          <div>
            <a
              href="#"
              target="_self"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-md transition duration-300"
            >
              VIEW OUR IMPACT
            </a>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center bg-transparent">
          <img
            src="https://about.grubhub.com/wp-content/uploads/2025/06/header-about_721x756_v2c.png"
            alt="Restaurants Impact"
            className="w-full max-w-md rounded-lg shadow-md  bg-transparent"
          />
        </div>
      </div>

      <div className="relative max-w-full mx-auto mt-20 px-4">
        <svg
          className="absolute inset-0 w-full h-36 md:h-40"
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

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-around gap-10 mt-10">

          <div className="flex flex-col items-center text-center mt-4">
            <div className="w-28 h-28 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
              <img
                src="https://about.grubhub.com/wp-content/uploads/2025/06/circle-3_156x156c_v2.png"
                alt="Food"
                className="w-26 h-26"
              />
            </div>
            <p className="text-3xl font-bold text-black mt-4">8k+</p>
            <p className="text-gray-600 text-sm mt-1">POUNDS OF FOOD RECOVERED</p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
              <img
                src="https://about.grubhub.com/wp-content/uploads/2025/06/circle-2-1_156x156c_v2.png"
                alt="Meals"
                className="w-26 h-26"
              />
            </div>
            <p className="text-3xl font-bold text-black mt-4">12k+</p>
            <p className="text-gray-600 text-sm mt-1">MEALS PROVIDED</p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
              <img
                src="https://about.grubhub.com/wp-content/uploads/2025/06/circle-1_156x156c_v2.png"
                alt="Grants"
                className="w-26 h-26"
              />
            </div>
            <p className="text-3xl font-bold text-black mt-4">300+</p>
            <p className="text-gray-600 text-sm mt-1">GRANTS TO INDEPENDENT RESTAURANTS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Choose;

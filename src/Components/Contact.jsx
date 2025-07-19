import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6f1] to-[#eae6f7] px-4 sm:px-6 md:px-8 py-8 sm:py-10 flex flex-col md:flex-row justify-between items-start relative">
      <div className="w-full md:w-1/3 space-y-4 sm:space-y-6 text-red-900 z-10 ml-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center md:text-left">Customer Support</h2>
        <p className="text-sm sm:text-base md:text-lg text-center md:text-left">
          Email:{' '}
          <a href="mailto:support@gmail.com" className="text-orange-600 font-semibold">
            support@gmail.com
          </a>
        </p>
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-center md:text-left">Find us on</h3>
        </div>
        <div className="flex justify-center md:justify-start">
          <div className='flex gap-2 sm:gap-3'>
            <a className="text-red-900 py-2 sm:py-3 px-2" href="/#"><FaFacebook className='size-6 sm:size-7 md:size-8 hover:text-red-400'/></a>
            <a className="text-red-900 py-2 sm:py-3 px-2" href="/#"><FaInstagram className='size-6 sm:size-7 md:size-8 hover:text-red-400'/></a>
            <a className="text-red-900 py-2 sm:py-3 px-2" href="/#"><FaTwitter className='size-6 sm:size-7 md:size-8 hover:text-red-400'/></a>
            <a className="text-red-900 py-2 sm:py-3 px-2" href="/#"><FaYoutube className='size-6 sm:size-7 md:size-8 hover:text-red-400'/></a>
          </div>
        </div>
        <div className="text-center md:text-left">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=india"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 bg-orange-600 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full font-semibold hover:bg-orange-700 transition text-sm sm:text-base"
          >
            Get Directions
          </a>
        </div>
        <div className="hidden md:flex justify-center md:justify-start">
          <img
            src="https://www.swiggy.com/corporate/wp-content/uploads/2024/10/yoga-day-2.webp"
            alt="Decoration"
            className="w-32 h-32 sm:w-36 sm:h-36 md:w-42 md:h-42"
          />
        </div>
      </div>

      <div className="w-full md:w-[45%] bg-white shadow-xl rounded-2xl p-6 sm:p-8 mt-8 md:mt-0 relative z-10 mr-15">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-red-900 text-center md:text-left">Get in touch</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Name"
            required
            className="w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
          />
          <input
            type="email"
            placeholder="Enter Email Address"
            required
            className="w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
          />
          <textarea
            placeholder="Enter Message"
            rows="5"
            required
            className="w-full border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm sm:text-base"
          ></textarea>
          <button
            type="button"
            className="bg-orange-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-md hover:bg-orange-700 transition text-sm sm:text-base"
          >
            Submit
          </button>
        </div>
        <p className="text-xs sm:text-sm mt-4 text-center md:text-left">
          By contacting us you agree to the{' '}
          <a href="#" className="text-orange-600 font-semibold">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="text-orange-600 font-semibold">
            Privacy Policy
          </a>
        </p>
        <img
          src="https://www.swiggy.com/corporate/wp-content/uploads/2024/10/Sandwich-1-796x1024.webp"
          alt="Sandwich"
          className="absolute top-[-20px] right-[-20px] w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44"
        />
      </div>
    </div>
  );
};

export default Contact;
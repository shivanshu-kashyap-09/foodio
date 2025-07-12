import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaVoicemail, FaYoutube } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen mt-15 bg-gradient-to-br from-[#fdf6f1] to-[#eae6f7] px-6 py-10 flex flex-col md:flex-row justify-between items-start relative">
      
      <div className="w-full md:w-1/2 space-y-6 text-red-900 z-10 ml-15">
        <h2 className="text-4xl font-bold">Customer Support</h2>
        <p className="text-lg">
          Email:{' '}
          <a href="mailto:support@gmail.com" className="text-orange-600 font-semibold">
            support@gmail.com
          </a>
        </p>

        <div>
          <h3 className="text-xl font-semibold mb-2">Find us on</h3>
        </div>
        <div>
          <div className=' flex '>
                    <a className="text-red-900 py-5 px-2" href="/#"><FaFacebook className='size-8 hover:text-red-400'/></a>
                    <a className="text-red-900 py-5 px-2" href="/#"><FaInstagram className='size-8 hover:text-red-400'/></a>
                    <a className="text-red-900 py-5 px-2" href="/#"><FaTwitter className='size-8 hover:text-red-400'/></a>
                    <a className="text-red-900 py-5 px-2" href="/#"><FaYoutube className='size-8 hover:text-red-400'/></a>
                    {/* <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/choose">Choose Us</a> */}
                    </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=india"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 bg-orange-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-700 transition"
          >
            Get Directions
          </a>
        </div>

        <img
          src="https://www.swiggy.com/corporate/wp-content/uploads/2024/10/yoga-day-2.webp"
          alt="Decoration"
          className="w-42 h-42"
        />
      </div>

      <div className="w-full md:w-[42%] bg-white shadow-xl rounded-2xl p-8 mt-10 md:mt-0 relative z-10 mr-15">
        <h3 className="text-2xl font-bold mb-6 text-red-900">Get in touch</h3>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Enter Name"
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="email"
            placeholder="Enter Email Address"
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <textarea
            placeholder="Enter Message"
            rows="5"
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          ></textarea>
          <button
            type="submit"
            className="bg-orange-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-orange-700 transition"
          >
            Submit
          </button>
        </form>
        <p className="text-sm mt-4">
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
          className="absolute top-[-30px] right-[-30px] w-44 h-44"
        />
      </div>
    </div>
  );
};

export default Contact;

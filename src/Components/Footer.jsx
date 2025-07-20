import React from 'react'
import logo from "../assets/logo.png";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-red-200 w-full'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 max-w-7xl mx-auto'>
        <div className='flex flex-col items-center'>
          <img src={logo} alt="logo" className='mt-4 w-12 sm:w-16 lg:w-20' />
          <h2 className="text-red-900 font-bold text-2xl sm:text-3xl px-2 text-center">FOODIO</h2>
          <div className='hidden lg:flex justify-center text-center gap-2 sm:gap-3 mt-4'>
            <Link className="text-red-900 py-5 px-2" to="/#home"><FaFacebook className='size-6 sm:size-7 lg:size-8 hover:text-red-400'/></Link>
            <Link className="text-red-900 py-5 px-2" to="/restaurant"><FaInstagram className='size-6 sm:size-7 lg:size-8 hover:text-red-400'/></Link>
            <Link className="text-red-900 py-5 px-2" to="/cart"><FaTwitter className='size-6 sm:size-7 lg:size-8 hover:text-red-400'/></Link>
            <Link className="text-red-900 py-5 px-2" to="/wishlist"><FaYoutube className='size-6 sm:size-7 lg:size-8 hover:text-red-400'/></Link>
          </div>
        </div>
        <div className='hidden lg:flex lg:flex-col lg:items-center lg:text-center'>
          <h2 className='text-red-900 font-bold text-xl sm:text-2xl mt-4 underline'>Quick Links</h2>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="#">Home</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/restaurant">Restaurant</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/cart">Cart</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/wishlist">Wishlist</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/choose">Choose Us</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/contact">Contact</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/login">Login</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/signup">Signup</Link>
        </div>
        <div className='hidden lg:flex lg:flex-col lg:items-center lg:text-center'>
          <h2 className='text-red-900 font-bold text-xl sm:text-2xl mt-4 underline mb-4'>Dishes</h2>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="#">Veg</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="#">Non Veg</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="#">South Indian</Link>
          {/* <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="#">Bakery</Link> */}
        </div>
        <div className='hidden lg:flex lg:flex-col lg:items-center lg:text-center'>
          <h2 className='text-red-900 font-bold text-xl sm:text-2xl mt-4 underline'>Restaurants</h2>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/restaurant">White Rabbit</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/restaurant">Pizza Castel</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/restaurant">Pizza Hurt</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/restaurant">StarBuks</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/restaurant">Dominos</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/restaurant">Burgger King</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/restaurant">Subway</Link>
          <Link className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" to="/restaurant">Hoshiyarpuri</Link>
        </div>
        <div className='grid grid-cols-3 gap-4 col-span-1 sm:col-span-2 lg:hidden'>
          <div className='flex flex-col items-center text-center'>
            <h2 className='text-red-900 font-bold text-xl mt-4 underline'>Quick Links</h2>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="#">Home</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/restaurant">Restaurant</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/cart">Cart</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/wishlist">Wishlist</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/choose">Choose Us</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/contact">Contact</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/login">Login</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/signup">Signup</Link>
          </div>
          <div className='flex flex-col items-center text-center'>
            <h2 className='text-red-900 font-bold text-xl mt-4 underline mb-4'>Dishes</h2>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="#">Veg</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="#">Non Veg</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="#">South Indian</Link>
            {/* <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/#bakery">Bakery</Link> */}
          </div>
          <div className='flex flex-col items-center text-center'>
            <h2 className='text-red-900 font-bold text-xl mt-4 underline'>Restaurants</h2>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/restaurant">White Rabbit</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/restaurant">Pizza Castel</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/restaurant">Pizza Hurt</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/restaurant">StarBuks</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/restaurant">Dominos</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/restaurant">Burgger King</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/restaurant">Subway</Link>
            <Link className="text-red-900 font-semibold text-sm px-3 py-1" to="/restaurant">Hoshiyarpuri</Link>
          </div>
        </div>
        <div className='flex justify-center text-center gap-2 sm:gap-3 col-span-1 sm:col-span-2 lg:hidden'>
          <Link className="text-red-900 py-5 px-2" to="#"><FaFacebook className='size-6 sm:size-7 hover:text-red-400'/></Link>
          <Link className="text-red-900 py-5 px-2" to="#"><FaInstagram className='size-6 sm:size-7 hover:text-red-400'/></Link>
          <Link className="text-red-900 py-5 px-2" to="#"><FaTwitter className='size-6 sm:size-7 hover:text-red-400'/></Link>
          <Link className="text-red-900 py-5 px-2" to="#"><FaYoutube className='size-6 sm:size-7 hover:text-red-400'/></Link>
        </div>
        <div className='w-full text-center py-4 sm:py-5 text-red-800 text-sm sm:text-base col-span-1 sm:col-span-2 lg:col-span-4'>@copy right - 2025 design and devlpoes by shivanshu</div>
      </div>
    </footer>
  )
}

export default Footer
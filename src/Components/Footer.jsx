import React from 'react'
import logo from "../assets/logo.png";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='bg-red-200 w-full'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 max-w-7xl mx-auto'>
        <div className='flex flex-col items-center'>
          <img src={logo} alt="logo" className='mt-4 w-12 sm:w-16 lg:w-20' />
          <h2 className="text-red-900 font-bold text-2xl sm:text-3xl px-2 text-center">FOODIO</h2>
          <div className='hidden lg:flex justify-center text-center gap-2 sm:gap-3 mt-4'>
            <a className="text-red-900 py-5 px-2" href="/#home"><FaFacebook className='size-6 sm:size-7 lg:size-8 hover:text-red-400'/></a>
            <a className="text-red-900 py-5 px-2" href="/restaurant"><FaInstagram className='size-6 sm:size-7 lg:size-8 hover:text-red-400'/></a>
            <a className="text-red-900 py-5 px-2" href="/cart"><FaTwitter className='size-6 sm:size-7 lg:size-8 hover:text-red-400'/></a>
            <a className="text-red-900 py-5 px-2" href="/wishlist"><FaYoutube className='size-6 sm:size-7 lg:size-8 hover:text-red-400'/></a>
          </div>
        </div>
        <div className='hidden lg:flex lg:flex-col lg:items-center lg:text-center'>
          <h2 className='text-red-900 font-bold text-xl sm:text-2xl mt-4 underline'>Quick Links</h2>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/#home">Home</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/restaurant">Restaurant</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/cart">Cart</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/wishlist">Wishlist</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/choose">Choose Us</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/contact">Contact</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/login">Login</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/signup">Signup</a>
        </div>
        <div className='hidden lg:flex lg:flex-col lg:items-center lg:text-center'>
          <h2 className='text-red-900 font-bold text-xl sm:text-2xl mt-4 underline mb-4'>Dishes</h2>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/#veg">Veg</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/#nonveg">Non Veg</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/#south">South Indian</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/#bakery">Bakery</a>
        </div>
        <div className='hidden lg:flex lg:flex-col lg:items-center lg:text-center'>
          <h2 className='text-red-900 font-bold text-xl sm:text-2xl mt-4 underline'>Restaurants</h2>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/restaurant">White Rabbit</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/restaurant">Pizza Castel</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/restaurant">Pizza Hurt</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/restaurant">StarBuks</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/restaurant">Dominos</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/restaurant">Burgger King</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/restaurant">Subway</a>
          <a className="text-red-900 font-semibold text-sm sm:text-base lg:text-[16px] px-3 py-1" href="/restaurant">Hoshiyarpuri</a>
        </div>
        <div className='grid grid-cols-3 gap-4 col-span-1 sm:col-span-2 lg:hidden'>
          <div className='flex flex-col items-center text-center'>
            <h2 className='text-red-900 font-bold text-xl mt-4 underline'>Quick Links</h2>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/#home">Home</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/restaurant">Restaurant</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/cart">Cart</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/wishlist">Wishlist</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/choose">Choose Us</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/contact">Contact</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/login">Login</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/signup">Signup</a>
          </div>
          <div className='flex flex-col items-center text-center'>
            <h2 className='text-red-900 font-bold text-xl mt-4 underline mb-4'>Dishes</h2>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/#veg">Veg</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/#nonveg">Non Veg</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/#south">South Indian</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/#bakery">Bakery</a>
          </div>
          <div className='flex flex-col items-center text-center'>
            <h2 className='text-red-900 font-bold text-xl mt-4 underline'>Restaurants</h2>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/restaurant">White Rabbit</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/restaurant">Pizza Castel</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/restaurant">Pizza Hurt</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/restaurant">StarBuks</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/restaurant">Dominos</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/restaurant">Burgger King</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/restaurant">Subway</a>
            <a className="text-red-900 font-semibold text-sm px-3 py-1" href="/restaurant">Hoshiyarpuri</a>
          </div>
        </div>
        <div className='flex justify-center text-center gap-2 sm:gap-3 col-span-1 sm:col-span-2 lg:hidden'>
          <a className="text-red-900 py-5 px-2" href="/#home"><FaFacebook className='size-6 sm:size-7 hover:text-red-400'/></a>
          <a className="text-red-900 py-5 px-2" href="/restaurant"><FaInstagram className='size-6 sm:size-7 hover:text-red-400'/></a>
          <a className="text-red-900 py-5 px-2" href="/cart"><FaTwitter className='size-6 sm:size-7 hover:text-red-400'/></a>
          <a className="text-red-900 py-5 px-2" href="/wishlist"><FaYoutube className='size-6 sm:size-7 hover:text-red-400'/></a>
        </div>
        <div className='w-full text-center py-4 sm:py-5 text-red-800 text-sm sm:text-base col-span-1 sm:col-span-2 lg:col-span-4'>@copy right - 2025 design and devlpoes by shivanshu</div>
      </div>
    </footer>
  )
}

export default Footer
import React from 'react'
import logo from "../assets/logo.png";
import { FaFacebook, FaInstagram, FaTwitter, FaVoicemail, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='h-100 bg-red-200'>
      <div className='h-100 grid grid-cols-4'>
        <div className='h-80'>
          <img src={logo} alt="logo" className='mt-4 w-50 ml-13' />
          <h2 className="text-red-900 font-bold text-3xl px-2 text-center">FOODIO</h2>
          <div className='justify-center flex text-center'>
          <a className="text-red-900 py-5 px-2" href="/#home"><FaFacebook className='size-8 hover:text-red-400'/></a>
          <a className="text-red-900 py-5 px-2" href="/restaurant"><FaInstagram className='size-8 hover:text-red-400'/></a>
          <a className="text-red-900 py-5 px-2" href="/cart"><FaTwitter className='size-8 hover:text-red-400'/></a>
          <a className="text-red-900 py-5 px-2" href="/wishlist"><FaYoutube className='size-8 hover:text-red-400'/></a>
          {/* <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/choose">Choose Us</a> */}
          </div>
        </div>
        <div className='h-80 grid grid-rows-1 text-center '>
          <h2 className='text-red-900 text-center font-bold text-2xl mt-4 underline'>Quick Links</h2>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/#home">Home</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/restaurant">Restaurant</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/cart">Cart</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/wishlist">Wishlist</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/choose">Choose Us</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/contact">Contact</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/login">Login</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/signup">Signup</a>
        </div>
        <div className='h-80 flex flex-col items-center text-center mr-20'>
          <h2 className='text-red-900 text-center font-bold text-2xl mt-4 underline mb-4'>Dishes</h2>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1 tex-left" href="/#veg">Veg</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/#nonveg">Non Veg</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/#south">Siuth Indian</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/#bakery">Bakery</a>
          {/* <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/choose">Choose Us</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/contact">Contact</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/login">Login</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/signup">Signup</a> */}
        </div>
        <div className='h-80 grid grid-rows-1 '>
          <h2 className='text-red-900 font-bold text-2xl mt-4 underline'>Restaurants</h2>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/restaurant">White Rabbit</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/restaurant">Pizza Castel</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/restaurant">PIzza Hurt</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/restaurant">StarBuks</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/restaurant">Dominos</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/restaurant">Burgger King</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/restaurant">Subway</a>
          <a className="text-red-900 font-semibold text-[16px] px-3 py-1" href="/restaurant">Hoshiyarpuri</a>
        </div>
        <div className='h-16 w-screen text-center py-5 text-red-800'>@copy right - 2025 design and devlpoes by shivanshu</div>
      </div>

    </footer>
  )
}

export default Footer
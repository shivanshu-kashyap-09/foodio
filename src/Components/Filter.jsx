import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const Filter = () => {
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [delivery, setDelivery] = useState('');

  return (
    <div className='border border-red-600 h-75 w-100 z-10 absolute right-0 top-0 bg-gradient-to-b from-red-200 to-red-100 shadow-xl rounded-3xl'>

      <h2 className='text-red-900 text-center font-bold text-3xl mt-4 mb-4'>FOOD FILTER</h2>

      <label className='ml-10 font-bold text-2xl text-red-700 mb-4'>Price</label>
      <select
        className='tex-center item-center ml-15 h-10 w-50 font-semibold text-red-600 border-red-800 border-2 rounded-2xl mb-4'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      >
        <option className='text-center text-red-700 bg-red-200 font-semibold'>Please choose a Price</option>
        <option className='text-red-700 bg-red-200 font-semibold'>Below 100</option>
        <option className='text-red-700 bg-red-200 font-semibold'>100-300</option>
        <option className='text-red-700 bg-red-200 font-semibold'>300-600</option>
        <option className='text-red-700 bg-red-200 font-semibold'>600-900</option>
        <option className='text-red-700 bg-red-200 font-semibold'>999+</option>
      </select>

      <label className='ml-10 font-bold text-2xl text-red-700 mb-4'>Rating</label>
      <select
        className='tex-center item-center ml-10 h-10 w-50 font-semibold text-red-600 border-red-800 border-2 rounded-2xl mb-4'
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      >
        <option className='text-center text-red-700 bg-red-200 font-semibold'>Please choose a Rating</option>
        <option className='text-red-700 bg-red-200 font-semibold'>★★★★★</option>
        <option className='text-red-700 bg-red-200 font-semibold'>★★★★☆</option>
        <option className='text-red-700 bg-red-200 font-semibold'>★★★☆☆</option>
        <option className='text-red-700 bg-red-200 font-semibold'>★★☆☆☆</option>
        <option className='text-red-700 bg-red-200 font-semibold'>★☆☆☆☆</option>
      </select>

      <label className='ml-10 font-bold text-2xl text-red-700 mb-4'>Delivery</label>
      <select
        className='tex-center item-center ml-6 h-10 w-50 font-semibold text-red-600 border-red-800 border-2 rounded-2xl mb-4'
        value={delivery}
        onChange={(e) => setDelivery(e.target.value)}
      >
        <option className='text-center text-red-700 bg-red-200 font-semibold'>Please choose Delivery</option>
        <option className='text-red-700 bg-red-200 font-semibold'>Fast Delivery</option>
      </select>
    </div>
  );
};

export default Filter;

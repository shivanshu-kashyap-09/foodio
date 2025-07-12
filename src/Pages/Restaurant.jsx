import React, { useEffect, useState } from 'react'
import RestaurantCard from "../Components/RestaurantCard";
import Menu from "../Components/Menu";
import DishCard from "../Components/DishCard";
import axios from 'axios';
const Restaurant = () => {
  const [vegRes, setVegRes] = useState([]);
  const [nonVegRes, setNonVegRes] = useState([]);
  const [southRes, setSouthRes] = useState([]);
  const [vegMenu, setVegMenu] = useState([]);
  const [nonVegMenu, setNonVegMenu] = useState([]);
  const [southMenu, setSouthMenu] = useState([]);

  const handleVegRes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/vegrestaurant/all`);
      if (response.status == 200) {
        setVegRes(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleNonVegRes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/nonvegrestaurant/all`);
      if (response.status == 200) {
        setNonVegRes(response.data);
      }
    } catch (error) {
      console.error(error);

    }
  }

  const handleSouthRes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/southindianrestaurants/all`);
      if (response.status == 200) {
        setSouthRes(response.data);
      }
    } catch (error) {
      console.error(error);

    }
  }

  const handleVegResMenu = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/vegmenu/id/${vegRes[0].res_id}`);
      if (response.status == 200) {
        setVegMenu(response.data);
      }
    } catch (error) {
      console.error(error);

    }
  }

  const handleNonVegMenu = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/nonvegmenu/id/${nonVegRes[0].res_id}`);
      if (response.status == 200) {
        setNonVegMenu(response.data);
      }
    } catch (error) {
      console.error(error);

    }
  }

  const handleSouthMenu = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/southindianmenu/id/${southRes[0].res_id}`);
      if(response.status == 200){
        setSouthMenu(response.data);
      }
    } catch (error) {
      console.error(error);
      
    }
  }

  useEffect(() => {
    handleVegRes();
    handleNonVegRes();
    handleSouthRes();
  }, []);

  useEffect(() => {
    if (vegRes.length > 0) {
      handleVegResMenu();
    }
  }, [vegRes]);

  useEffect(() => {
    if (nonVegRes.length > 0) {
      handleNonVegMenu();
    }
  }, [nonVegRes]);

  useEffect(() => {
    if(southRes.length > 0){
      handleSouthMenu();
    }
  }, [southRes]);
  

  return (
    <div className='mt-20 mb-4'>
      <h2 className='text-red-900 font-bold text-4xl text-center mt-5 mb-10'>VEG RESTAURANT</h2>
      <div className='grid grid-cols-4'>
        {vegRes.slice(0, 4).map((res, index) => (
          <RestaurantCard key={index} restaurant={res} />
        ))}
      </div>

      <h2 className='text-red-900 font-bold text-4xl text-center mt-5 mb-10'>NONVEG RESTAURANT</h2>
      <div className='grid grid-cols-4'>
        {nonVegRes.slice(0, 4).map((res, index) => (
          <RestaurantCard key={index} restaurant={res} />
        ))}
      </div>

      <h2 className='text-red-900 font-bold text-4xl text-center mt-5 mb-10'>SOUTH INDIAN RESTAURANT</h2>
      <div className='grid grid-cols-4'>
        {southRes.slice(0, 4).map((res, index) => (
          <RestaurantCard key={index} restaurant={res} />
        ))}
      </div>

      {vegRes.length > 0 && (
        <h2 className='text-red-900 font-bold text-4xl text-center mt-5 mb-10'>
          {vegRes[0].res_name}
        </h2>
      )}

      <div className="flex gap-6 mx-4 items-start">
        <div className='w-1/4 border-3 border-red-700 p-4 bg-white rounded-xl shadow-md'>
          <h2 className='text-red-900 font-bold text-4xl text-center border-b-3 bg-red-50 '>MENU</h2>
          <Menu menu={vegMenu} />
        </div>
        <div className="w-3/4 grid grid-cols-3 gap-4">
          {vegMenu.slice(0, 9).map((dish, index) => (
            <DishCard key={index} {...dish} />
          ))}
        </div>
      </div>

      {nonVegRes.length > 0 && (
        <h2 className='text-red-900 font-bold text-4xl text-center mt-5 mb-10'>{nonVegRes[0].res_name}</h2>
      )}
      <div className="flex gap-6 mx-4 items-start">
        <div className='w-1/4 border-3 border-red-700 p-4 bg-white rounded-xl shadow-md'>
          <h2 className='text-red-900 font-bold text-4xl text-center border-b-3 bg-red-50 '>MENU</h2>
          <Menu menu={nonVegMenu} />
        </div>
        <div className="w-3/4 grid grid-cols-3 gap-4">
          {nonVegMenu.slice(0, 9).map((dish, index) => (
            <DishCard key={index} {...dish} />
          ))}
        </div>
      </div>

      {southRes.length > 0 && (
        <h2 className='text-red-900 font-bold text-4xl text-center mt-5 mb-10'>{southRes[0].res_name}</h2>
      )}
      <div className="flex gap-6 mx-4 items-start">
        <div className='w-1/4 border-3 border-red-700 p-4 bg-white rounded-xl shadow-md'>
          <h2 className='text-red-900 font-bold text-4xl text-center border-b-3 bg-red-50 '>MENU</h2>
          <Menu menu={southMenu} />
        </div>
        <div className="w-3/4 grid grid-cols-3 gap-4">
          {southMenu.slice(0, 9).map((dish, index) => (
            <DishCard key={index} {...dish} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Restaurant
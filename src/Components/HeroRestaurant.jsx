import React from 'react';

const HeroRestaurant = ({ restaurantName, dishes, link }) => {
  return (
    <div className="bg-red-50 rounded-md shadow-md p-4 h-10-0 w-80 mb-4 ">
      <h2 className="text-lg font-bold mb-4 text-red-700 text-center">{restaurantName}</h2>

      <div className="grid grid-cols-2 gap-4">
        {dishes.map((dish, index) => (
          <div className="text-center" key={index}>
            <img
              src={dish.image}
              alt={dish.name}
              className="rounded-md w-full object-cover"
            />
            <p className="text-sm mt-2 font-semibold text-red-700 text-center">{dish.name}</p>
            <p className="text-sm mt-2 font-semibold text-red-700 text-center">{dish.price}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <a
          href={link}
          className="hover:underline font-bold text-red-700 text-center"
        >
          Explore more dishes
        </a>
      </div>
    </div>
  );
};

export default HeroRestaurant;

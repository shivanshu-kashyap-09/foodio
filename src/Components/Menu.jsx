import React from 'react';

const Menu = ({menu}) => {
  return (
    <div className="space-y-2">
      {menu.map((dish, index) => (
        <div key={index} className="border-b-2 border-red-700 grid grid-cols-2">
          <h2 className="ml-5 text-xl font-bold text-red-700">{dish.dish_name}</h2>
          <h2 className="ml-20 text-xl font-semibold text-red-600">{dish.dish_price}</h2>
        </div>
      ))}
    </div>
  );
};

export default Menu;

import React, { useState, useEffect, useRef } from 'react';

const Menu = ({ menu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="lg:hidden w-full bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-lg focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Menu' : 'Menu'}
      </button>

      <div className={`space-y-2 mt-2 lg:mt-0 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {menu.map((dish, index) => (
          <div key={index} className="border-b-2 border-red-700 grid grid-cols-2 gap-2 py-2">
            <h2 className="ml-2 sm:ml-5 text-base sm:text-lg lg:text-xl font-bold text-red-700">{dish.dish_name}</h2>
            <h2 className="ml-20 sm:ml-10 lg:ml-20 text-base sm:text-lg lg:text-xl font-semibold text-red-600">{dish.dish_price}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
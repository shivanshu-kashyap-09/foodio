import React, { useState } from "react";

const EditDishModal = ({ dishId, currentName, currentImage, currentDescription, currentPrice, currentRating, onClose, onSave }) => {
  const [form, setForm] = useState({
    dish_id: dishId,
    dish_name: currentName,
    dish_image: currentImage,
    dish_description: currentDescription,
    dish_price: currentPrice,
    dish_rating: currentRating,

  });
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] ">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl text-gray-600 hover:text-red-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center text-red-600 mb-4">
          Edit Dish
        </h2>

        <input
          name="dish_name"
          value={form.dish_name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2"
          placeholder="Dish Name"
        />

        <input
          name="dish_image"
          value={form.dish_image}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2"
          placeholder="Image URL"
        />

        <textarea
          name="dish_description"
          value={form.dish_description}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2"
          rows={3}
        />

        <input
          name="dish_price"
          type="number"
          value={form.dish_price}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2"
        />

        <input
          name="dish_rating"
          type="number"
          step="0.1"
          value={form.dish_rating}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDishModal;

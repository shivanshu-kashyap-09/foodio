import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const Cart = () => {
  const [selected, setSelected] = useState('');
  const [cartItems, setCartItems] = useState([]);

  const handleGetCart = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/cart/get/1`);
      if (response.status == 200) {
        console.log(response.data);
        setCartItems(response.data);
      }
    } catch (error) {
      toast.error("Error in get cart");
      console.error(error);

    }
  }

  const handleDeleteOneCart = async (dish_name) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_URL}/cart/delete/id/1`, {
        data: { dish_name }
      });
      if (response.status == 200) {
        toast.success("dish remove successfully");
        handleGetCart();
      }
    } catch (error) {
      console.error(error);
      toast.error("dish is not delete");
    }
  }
  useEffect(() => {
    handleGetCart();
  }, []);

  const increaseQuantity = async (dish_name, dish_qty) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_URL}/cart/update/1`, {
        dish_name,
        dish_qty: dish_qty + 1
      });
      if (response.status == 200) {
        setCartItems(prev =>
          prev.map(item =>
            item.dish_name === dish_name
            ? { ...item, dish_qty: dish_qty + 1 }
            : item
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const decreaseQuantity = async (dish_name, dish_qty) => {
    try {
      if (dish_qty > 1) {
        const response = await axios.put(`${import.meta.env.VITE_URL}/cart/update/1`, {
          dish_name,
          dish_qty: dish_qty - 1
        });
        if (response.status == 200) {
          setCartItems(prev =>
            prev.map(item =>
              item.dish_name === dish_name
                ? { ...item, dish_qty: dish_qty - 1 }
                : item
            )
          );
        }
      }
    } catch (error) {
      console.error(error);

    }
  };

  const handleOrder = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/order/insert/1`,{
        items : total_items,
        total : totalToPay,
        payment : selected,
        delivery_status : "panding",
      });
      if(response.status == 201){
        toast.success("order is successfully done");
        await axios.delete(`${import.meta.env.VITE_URL}/cart/delete/all/1`);
        handleGetCart();
      }
    } catch (error) {
      toast.error("Order is not done")
      console.error(error);
      
    }
  }

  const handleSelect = (method) => setSelected(method);

  const itemTotal = cartItems.reduce((total, item) => total + item.dish_price * item.dish_qty, 0);
  const total_items = cartItems.reduce((acc, item) => acc + item.dish_qty, 0);
  const deliveryFee = 105;
  const gst = (itemTotal + deliveryFee) * 0.05;
  const totalToPay = itemTotal + deliveryFee + gst;

  return (
    <div className="bg-gray-100 min-h-screen mt-14">
      {/* <div className='h-14 w-screen bg-red-300'></div> */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">

        {/* Account Section */}
        <div className="mb-6">
          <h2 className="text-5xl font-bold mb-2 text-center text-red-900">Account</h2>
          <div className="flex items-center gap-4">
            <img
              src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_147,h_140/Image-login_btpq7r"
              alt="Login"
              className="w-32 h-32 object-contain"
            />
            <div>
              <p className="text-gray-700 mb-2">
                To place your order now, log in to your existing account or sign up.
              </p>
              <div className="flex gap-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded-md">LOG IN</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">SIGN UP</button>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Delivery Address</h2>
          {/* <p className="text-gray-600">Please select your delivery address.</p> */}
          <textarea name="" id="" placeholder='Please select your delivery address.' className='w-100 h-20 text-center border-none border-red-50 py-5'></textarea>
        </div>

        {/* Payment Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Payment</h2>
          <p className="text-gray-600 mb-4">Choose your payment method during checkout.</p>

          {/* Payment Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div
              onClick={() => handleSelect('UPI')}
              className={`border ${selected === 'UPI' ? 'border-red-500' : 'border-red-50'
                } rounded-lg shadow p-4 text-center hover:shadow-md cursor-pointer`}
            >
              <img
                src="https://img.icons8.com/color/48/upi.png"
                alt="UPI"
                className="mx-auto mb-2 w-10 h-10"
              />
              <p className="text-sm font-medium">UPI</p>
            </div>

            <div
              onClick={() => handleSelect('Cash')}
              className={`border ${selected === 'Cash' ? 'border-red-500' : 'border-red-50'
                } rounded-lg shadow p-4 text-center hover:shadow-md cursor-pointer`}
            >
              <img
                src="https://img.icons8.com/ios-filled/50/000000/cash-in-hand.png"
                alt="Cash"
                className="mx-auto mb-2 w-10 h-10"
              />
              <p className="text-sm font-medium">Cash</p>
            </div>

            <div
              onClick={() => handleSelect('NetBanking')}
              className={`border ${selected === 'NetBanking' ? 'border-red-500' : 'border-red-50'
                } rounded-lg shadow p-4 text-center hover:shadow-md cursor-pointer`}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/4488/4488426.png"
                alt="Net Banking"
                className="mx-auto mb-2 w-10 h-10"
              />
              <p className="text-sm font-medium">Net Banking</p>
            </div>

            <div
              onClick={() => handleSelect('Card')}
              className={`border ${selected === 'Card' ? 'border-red-500' : 'border-red-50'
                } rounded-lg shadow p-4 text-center hover:shadow-md cursor-pointer`}
            >
              <img
                src="https://img.icons8.com/fluency/48/bank-cards.png"
                alt="Credit Card"
                className="mx-auto mb-2 w-10 h-10"
              />
              <p className="text-sm font-medium">Credit Card</p>
            </div>
          </div>

          {/* Conditionally Render Fields */}
          {selected === 'UPI' && (
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700">Enter UPI ID</label>
              <input
                type="text"
                placeholder="example@upi"
                className="w-full border px-4 py-2 rounded"
              />
            </div>
          )}

          {selected === 'Card' && (
            <div className="space-y-4 mb-4">
              <div>
                <label className="block mb-1 text-sm text-gray-700">Card Number</label>
                <input
                  type="text"
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                  className="w-full border px-4 py-2 rounded"
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block mb-1 text-sm text-gray-700">Expiry</label>
                  <input type="text" placeholder="MM/YY" className="w-full border px-4 py-2 rounded" />
                </div>
                <div className="w-1/2">
                  <label className="block mb-1 text-sm text-gray-700">CVV</label>
                  <input type="password" placeholder="•••" className="w-full border px-4 py-2 rounded" />
                </div>
              </div>
            </div>
          )}

          {selected === 'NetBanking' && (
            <div className="mb-4">
              <label className="block mb-1 text-sm text-gray-700">Select Your Bank</label>
              <select className="w-full border px-4 py-2 rounded">
                <option value="">-- Select Bank --</option>
                <option value="SBI">SBI</option>
                <option value="HDFC">HDFC</option>
                <option value="ICICI">ICICI</option>
                <option value="Axis">Axis</option>
              </select>
            </div>
          )}

          {selected === 'Cash' && (
            <div className="text-green-600 text-sm font-medium">
              You'll pay with cash when the order is delivered.
            </div>
          )}
        </div>


        {/* Cart Item */}
        <div className="border-t pt-6 mt-6">
          {/* Header */}
          <div className="grid grid-cols-7 gap-3 bg-red-400 text-red-900 font-bold px-4 py-3">
            <h2>S.NO.</h2>
            <h2>IMAGE</h2>
            <h2>DISH NAME</h2>
            <h2 className='ml-9'>QTY</h2>
            <h2>PRICE</h2>
            <h2>TOTAL</h2>
            <h2>ACTION</h2>
          </div>

          {/* Cart Items */}
          {cartItems.map((item, index) => (
            <div key={item.id} className="grid grid-cols-7 gap-3 items-center px-4 py-3 border-b">
              {/* S.NO. */}
              <p className='text-center font-bold text-2xl text-red-700'>{index + 1}.</p>

              {/* Image */}
              <img
                src={item.dish_img}
                alt={item.deish_name}
                className="w-20 h-20 rounded object-cover"
              />

              {/* Dish Info */}
              <div>
                {/* <h3 className="text-md font-medium">{item.restaurant}</h3> */}
                {/* <p className="text-gray-500 text-sm">{item.location}</p> */}
                <p className="text-gray-700">{item.dish_name}</p>
              </div>

              {/* Quantity */}
              <p className="text-center text-green-700 font-semibold text-xl">{item.dish_qty || 1}</p>

              {/* Price */}
              <p className="text-green-700 font-semibold text-xl">₹{item.dish_price}</p>

              {/* Total */}
              <p className="text-green-700 font-bold text-xl">
                ₹{item.dish_price * (item.dish_qty || 1)}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  className="bg-green-700 text-white px-2 py-1 rounded-md"
                  onClick={() => increaseQuantity(item.dish_name, item.dish_qty)}
                >
                  <FaPlus />
                </button>
                <button
                  className="bg-white text-red-600 px-2 py-1 rounded-md border"
                  onClick={() => { handleDeleteOneCart(item.dish_name) }}
                >
                  <FaTrash />
                </button>
                <button
                  className="bg-green-700 text-white px-2 py-1 rounded-md"
                  onClick={() => decreaseQuantity(item.dish_name, item.dish_qty)}
                >
                  <FaMinus />
                </button>
              </div>
            </div>
          ))}
        </div>


        {/* Bill Section */}
        <div className="mt-3">
          <h2 className="text-xl font-semibold mb-4">Bill Details</h2>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span>₹{itemTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST & Other Charges</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-black pt-2 border-t">
              <span>TO PAY</span>
              <span>₹{totalToPay.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button className="bg-red-500 text-white px-6 py-2 rounded-md text-center font-semibold text-[20px] hover:bg-red-700"
          onClick={handleOrder}
          disabled={cartItems.length === 0 || !selected}>
            Order
          </button>
        </div>


        {/* Cancellation Note */}
        <div className="mt-6 p-4 bg-yellow-100 rounded-md">
          <h4 className="font-semibold text-yellow-800">Review your order and address details to avoid cancellations</h4>
          <p className="text-yellow-700 text-sm mt-2">
            <b>Note:</b> Please ensure your address and order details are correct. This order, if cancelled, is non-refundable.
            <br />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;

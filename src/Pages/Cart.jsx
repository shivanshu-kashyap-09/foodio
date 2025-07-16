import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const Cart = () => {
  const [selected, setSelected] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [editAddress, setEditAddress] = useState(false);
  const USER_ID = localStorage.getItem('user_id');

  const handleGetCart = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/cart/get/${USER_ID}`);
      if (response.status === 200) {
        setCartItems(response.data);
      }
    } catch (error) {
      toast.error("Error in getting cart");
      console.error(error);
    }
  };

  const handleDeleteOneCart = async (dish_name) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_URL}/cart/delete/id/${USER_ID}`, {
        data: { dish_name }
      });
      if (response.status === 200) {
        toast.success("Dish removed successfully");
        handleGetCart();
      }
    } catch (error) {
      console.error(error);
      toast.error("Dish could not be deleted");
    }
  };

  const increaseQuantity = async (dish_name, dish_qty) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_URL}/cart/update/${USER_ID}`, {
        dish_name,
        dish_qty: dish_qty + 1
      });
      if (response.status === 200) {
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
        const response = await axios.put(`${import.meta.env.VITE_URL}/cart/update/${USER_ID}`, {
          dish_name,
          dish_qty: dish_qty - 1
        });
        if (response.status === 200) {
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
      const response = await axios.post(`${import.meta.env.VITE_URL}/order/insert/${USER_ID}`, {
        items: total_items,
        total: totalToPay,
        payment: selected,
        delivery_status: "pending",
      });
      if (response.status === 201) {
        toast.success("Order placed successfully");
        await axios.delete(`${import.meta.env.VITE_URL}/cart/delete/all/${USER_ID}`);
        handleGetCart();
      }
    } catch (error) {
      toast.error("Order failed");
      console.error(error);
    }
  };

  const handleSelect = (method) => setSelected(method);

  const itemTotal = cartItems.reduce((total, item) => total + item.dish_price * item.dish_qty, 0);
  const total_items = cartItems.reduce((acc, item) => acc + item.dish_qty, 0);
  const deliveryFee = 105;
  const gst = (itemTotal + deliveryFee) * 0.05;
  const totalToPay = itemTotal + deliveryFee + gst;

  const handleUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/user/get/${USER_ID}`);
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveAddress = async () => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_URL}/user/update/${USER_ID}`, user);
      if (res.status === 200) {
        toast.success("Address updated");
        setEditAddress(false);
        handleUser();
      }
    } catch (err) {
      toast.error("Failed to update address");
      console.error(err);
    }
  };

  useEffect(() => {
    handleGetCart();
    handleUser();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen mt-14">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Account Section */}
        <div className="mb-6">
          <h2 className="text-5xl font-bold mb-4 text-center text-red-900">Account</h2>
          {!user ? (
            <div className="flex items-center gap-4">
              <img
                src="https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
                alt="Login"
                className="w-32 h-32 object-contain"
              />
              <div>
                <p className="text-gray-700 mb-2">
                  To place your order now, log in to your existing account or sign up.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => window.location.href = "/login"}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    LOG IN
                  </button>
                  <button
                    onClick={() => window.location.href = "/signup"}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    SIGN UP
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <img
                src={
                user.user_img
                  ? user.user_img.startsWith('http')
                    ? user.user_img
                    : `${import.meta.env.VITE_URL}${user.user_img}`
                  : "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
              }
                alt="User"
                className="w-40 h-40 rounded-full object-cover border"
              />
              <div className="flex flex-col gap-1 text-lg">
                <h3 className="text-2xl font-semibold text-red-700">{user.user_name}</h3>
                <p className="text-gray-700">📞 {user.user_phone}</p>
                <p className="text-gray-700">📧 {user.user_gmail}</p>
                <div className="relative">
                  <h4 className="text-lg font-semibold mt-4">Address</h4>
                  <button
                    onClick={() => setEditAddress(!editAddress)}
                    className="absolute top-0 right-0 text-red-600 hover:text-red-800"
                  >
                    <FaEdit />
                  </button>
                  {editAddress ? (
                    <>
                      <textarea
                        rows={3}
                        value={user.user_address || ''}
                        onChange={(e) => setUser({ ...user, user_address: e.target.value })}
                        className="w-full border rounded px-3 py-2 mt-2"
                        placeholder="Enter your address"
                      />
                      <button
                        className="mt-2 px-4 py-1 bg-green-600 text-white rounded-md"
                        onClick={handleSaveAddress}
                      >
                        Save Address
                      </button>
                    </>
                  ) : (
                    <p className="text-gray-600 mt-2">{user.user_address || "No address added."}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Payment</h2>
          <p className="text-gray-600 mb-4">Choose your payment method during checkout.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {['UPI', 'Cash', 'NetBanking', 'Card'].map(method => (
              <div
                key={method}
                onClick={() => handleSelect(method)}
                className={`border ${selected === method ? 'border-red-500' : 'border-red-50'} rounded-lg shadow p-4 text-center hover:shadow-md cursor-pointer`}
              >
                <img
                  src={{
                    UPI: 'https://img.icons8.com/color/48/upi.png',
                    Cash: 'https://img.icons8.com/ios-filled/50/000000/cash-in-hand.png',
                    NetBanking: 'https://cdn-icons-png.flaticon.com/128/4488/4488426.png',
                    Card: 'https://img.icons8.com/fluency/48/bank-cards.png'
                  }[method]}
                  alt={method}
                  className="mx-auto mb-2 w-10 h-10"
                />
                <p className="text-sm font-medium">{method}</p>
              </div>
            ))}
          </div>

          {selected === 'UPI' && (
            <input type="text" placeholder="example@upi" className="w-full border px-4 py-2 rounded mb-4" />
          )}
          {selected === 'Card' && (
            <div className="space-y-4 mb-4">
              <input type="text" placeholder="xxxx-xxxx-xxxx-xxxx" className="w-full border px-4 py-2 rounded" />
              <div className="flex gap-4">
                <input type="text" placeholder="MM/YY" className="w-1/2 border px-4 py-2 rounded" />
                <input type="password" placeholder="CVV" className="w-1/2 border px-4 py-2 rounded" />
              </div>
            </div>
          )}
          {selected === 'NetBanking' && (
            <select className="w-full border px-4 py-2 rounded mb-4">
              <option value="">-- Select Bank --</option>
              <option>SBI</option>
              <option>HDFC</option>
              <option>ICICI</option>
              <option>Axis</option>
            </select>
          )}
          {selected === 'Cash' && (
            <div className="text-green-600 text-sm font-medium mb-4">
              You'll pay with cash when the order is delivered.
            </div>
          )}
        </div>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-rows-1">
              <h2 className="text-5xl font-bold mb-2 text-center text-red-900">Cart</h2>
              <img
                src="https://cdn-icons-png.flaticon.com/512/13637/13637462.png"
                alt="empty cart"
                className="w-50 h-50"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="border-t pt-6 mt-6">
              <div className="grid grid-cols-7 gap-3 bg-red-400 text-red-900 font-bold px-4 py-3">
                <h2>S.NO.</h2>
                <h2>IMAGE</h2>
                <h2>DISH NAME</h2>
                <h2 className='ml-9'>QTY</h2>
                <h2>PRICE</h2>
                <h2>TOTAL</h2>
                <h2>ACTION</h2>
              </div>
              {cartItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-7 gap-3 items-center px-4 py-3 border-b">
                  <p className='text-center font-bold text-2xl text-red-700'>{index + 1}.</p>
                  <img src={item.dish_img} alt={item.dish_name} className="w-20 h-20 rounded object-cover" />
                  <p className="text-gray-700">{item.dish_name}</p>
                  <p className="text-center text-green-700 font-semibold text-xl">{item.dish_qty || 1}</p>
                  <p className="text-green-700 font-semibold text-xl">₹{item.dish_price}</p>
                  <p className="text-green-700 font-bold text-xl">₹{item.dish_price * (item.dish_qty || 1)}</p>
                  <div className="flex items-center gap-2">
                    <button className="bg-green-700 text-white px-2 py-1 rounded-md" onClick={() => increaseQuantity(item.dish_name, item.dish_qty)}><FaPlus /></button>
                    <button className="bg-white text-red-600 px-2 py-1 rounded-md border" onClick={() => handleDeleteOneCart(item.dish_name)}><FaTrash /></button>
                    <button className="bg-green-700 text-white px-2 py-1 rounded-md" onClick={() => decreaseQuantity(item.dish_name, item.dish_qty)}><FaMinus /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="mt-3">
              <h2 className="text-xl font-semibold mb-4">Bill Details</h2>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between"><span>Item Total</span><span>₹{itemTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>GST</span><span>₹{gst.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-black pt-2 border-t"><span>TO PAY</span><span>₹{totalToPay.toFixed(2)}</span></div>
              </div>
            </div>
          </>
        )}

        {/* Place Order Button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-md text-[20px] hover:bg-red-700"
            onClick={handleOrder}
            disabled={cartItems.length === 0 || !selected}
          >
            Order
          </button>
        </div>

        {/* Cancellation Note */}
        <div className="mt-6 p-4 bg-yellow-100 rounded-md">
          <h4 className="font-semibold text-yellow-800">Review your order and address details to avoid cancellations</h4>
          <p className="text-yellow-700 text-sm mt-2">
            <b>Note:</b> Please ensure your address and order details are correct. This order, if cancelled, is non-refundable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;

import React, { useEffect, useState } from 'react';
import { FaMinus, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
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
      // toast.error("Error in getting cart");
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
    if (!selected) {
      toast.error("Please select a payment method");
      return;
    }

    // CASH ON DELIVERY
    if (selected === "Cash") {
      await placeOrder("Cash");
      return;
    }

    // LOAD RAZORPAY
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    try {
      // 1️⃣ Create order from backend
      const orderRes = await axios.post(
        `${import.meta.env.VITE_URL}/razorpay/create-order`,
        {
          amount: Math.round(totalToPay),
          currency: "INR",
        }
      );

      const order = orderRes.data;

      // 2️⃣ Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Foodio",
        description: "Food Order Payment",
        order_id: order.id,

        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },

        upi: {
          flow: "collect"     
        },

        handler: async (response) => {
          // 3️⃣ Verify payment
          const verifyRes = await axios.post(
            `${import.meta.env.VITE_URL}/razorpay/verify-payment`,
            response
          );

          if (verifyRes.data.success) {
            toast.success("Payment successful 🎉");
            await placeOrder("Online");
          } else {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: user?.user_name,
          email: user?.user_gmail,
          contact: user?.user_phone,
        },

        theme: { color: "#dc2626" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
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

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => { resolve(true); }
      script.onerror = () => { resolve(false); }
      document.body.appendChild(script);
    });
  }

  const placeOrder = async (paymentType) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/order/insert/${USER_ID}`,
        {
          items: total_items,
          total: totalToPay,
          payment: paymentType,
          delivery_status: "pending",
        }
      );

      if (response.status === 201) {
        toast.success("Order placed successfully");
        await axios.delete(
          `${import.meta.env.VITE_URL}/cart/delete/all/${USER_ID}`
        );
        handleGetCart();
      }
    } catch (error) {
      toast.error("Order failed");
      console.error(error);
    }
  };


  useEffect(() => {
    handleGetCart();
    handleUser();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen mt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full sm:max-w-4xl lg:max-w-5xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">

        <div className="mb-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center text-red-900">Account</h2>
          {!user ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src="https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
                alt="Login"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
              />
              <div className="text-center sm:text-left">
                <p className="text-gray-700 mb-4 text-sm sm:text-base">
                  To place your order now, log in to your existing account or sign up.
                </p>
                <div className="flex gap-4 justify-center sm:justify-start">
                  <button
                    onClick={() => window.location.href = "/login"}
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm sm:text-base hover:bg-red-600"
                  >
                    LOG IN
                  </button>
                  <button
                    onClick={() => window.location.href = "/signup"}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm sm:text-base hover:bg-blue-600"
                  >
                    SIGN UP
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <img
                src={
                  user.user_img
                    ? user.user_img.startsWith('http')
                      ? user.user_img
                      : `${import.meta.env.VITE_URL}${user.user_img}`
                    : "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
                }
                alt="User"
                className="w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full object-cover border"
              />
              <div className="flex flex-col gap-2 text-base sm:text-lg w-full">
                <h3 className="text-xl sm:text-2xl font-semibold text-red-700 text-center sm:text-left">{user.user_name}</h3>
                <p className="text-gray-700">📞 {user.user_phone}</p>
                <p className="text-gray-700">📧 {user.user_gmail}</p>
                <div className="relative">
                  <h4 className="text-base sm:text-lg font-semibold mt-4">Address</h4>
                  <button
                    onClick={() => setEditAddress(!editAddress)}
                    className="absolute top-0 right-0 text-red-600 hover:text-red-800 text-lg sm:text-xl"
                  >
                    <FaEdit />
                  </button>
                  {editAddress ? (
                    <>
                      <textarea
                        rows={3}
                        value={user.user_address || ''}
                        onChange={(e) => setUser({ ...user, user_address: e.target.value })}
                        className="w-full border rounded px-3 py-2 mt-2 text-sm sm:text-base"
                        placeholder="Enter your address"
                      />
                      <button
                        className="mt-2 px-4 py-1 bg-green-600 text-white rounded-md text-sm sm:text-base hover:bg-green-700"
                        onClick={handleSaveAddress}
                      >
                        Save Address
                      </button>
                    </>
                  ) : (
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">{user.user_address || "No address added."}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Payment</h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Choose your payment method during checkout.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {['UPI', 'Cash', 'NetBanking', 'Card'].map(method => (
              <div
                key={method}
                onClick={() => handleSelect(method)}
                className={`border ${selected === method ? 'border-red-500' : 'border-red-50'} rounded-lg shadow p-3 sm:p-4 text-center hover:shadow-md cursor-pointer`}
              >
                <img
                  src={{
                    UPI: 'https://img.icons8.com/color/48/upi.png',
                    Cash: 'https://img.icons8.com/ios-filled/50/000000/cash-in-hand.png',
                    NetBanking: 'https://cdn-icons-png.flaticon.com/128/4488/4488426.png',
                    Card: 'https://img.icons8.com/fluency/48/bank-cards.png'
                  }[method]}
                  alt={method}
                  className="mx-auto mb-2 w-8 h-8 sm:w-10 sm:h-10"
                />
                <p className="text-xs sm:text-sm font-medium">{method}</p>
              </div>
            ))}
          </div>
          {selected === 'Cash' && (
            <div className="text-green-600 text-xs sm:text-sm font-medium mb-4">
              You'll pay with cash when the order is delivered.
            </div>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-rows-1">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center text-red-900">Cart</h2>
              <img
                src="https://cdn-icons-png.flaticon.com/512/13637/13637462.png"
                alt="empty cart"
                className="w-40 h-40 sm:w-50 sm:h-50 mx-auto"
              />
            </div>
          </div>
        ) : (
          <>
            <div className="border-t pt-4 sm:pt-6 mt-4 sm:mt-6">
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 sm:gap-3 bg-red-400 text-red-900 font-bold px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                <h2 className="text-center">S.NO.</h2>
                <h2 className="hidden sm:block text-center">IMAGE</h2>
                <h2 className="text-center">DISH NAME</h2>
                <h2 className="text-center">QTY</h2>
                <h2 className="text-center">PRICE</h2>
                <h2 className="hidden sm:block text-center">TOTAL</h2>
                <h2 className="text-center">ACTION</h2>
              </div>
              {cartItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-5 sm:grid-cols-7 gap-2 sm:gap-3 items-center px-2 sm:px-4 py-2 sm:py-3 border-b text-xs sm:text-sm">
                  <p className="text-center font-bold text-red-700">{index + 1}.</p>
                  <img src={item.dish_img} alt={item.dish_name} className="hidden sm:block w-12 h-12 sm:w-16 sm:h-16 rounded object-cover mx-auto" />
                  <p className="text-gray-700 truncate">{item.dish_name}</p>
                  <p className="text-center text-green-700 font-semibold">{item.dish_qty || 1}</p>
                  <p className="text-center text-green-700 font-semibold">₹{item.dish_price}</p>
                  <p className="hidden sm:block text-center text-green-700 font-bold">₹{item.dish_price * (item.dish_qty || 1)}</p>
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <button className="bg-green-700 text-white p-1 sm:p-2 rounded-md text-xs sm:text-sm" onClick={() => increaseQuantity(item.dish_name, item.dish_qty)}><FaPlus /></button>
                    <button className="bg-white text-red-600 p-1 sm:p-2 rounded-md border text-xs sm:text-sm" onClick={() => handleDeleteOneCart(item.dish_name)}><FaTrash /></button>
                    <button className="bg-green-700 text-white p-1 sm:p-2 rounded-md text-xs sm:text-sm" onClick={() => decreaseQuantity(item.dish_name, item.dish_qty)}><FaMinus /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Bill Details</h2>
              <div className="space-y-2 text-gray-700 text-sm sm:text-base">
                <div className="flex justify-between"><span>Item Total</span><span>₹{itemTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>GST</span><span>₹{gst.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-black pt-2 border-t"><span>TO PAY</span><span>₹{totalToPay.toFixed(2)}</span></div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-center mt-4 sm:mt-6">
          <button
            className="bg-red-500 text-white px-4 sm:px-6 py-2 rounded-md text-base sm:text-lg hover:bg-red-700 disabled:bg-red-300"
            onClick={handleOrder}
            disabled={cartItems.length === 0 || !selected}
          >
            Order
          </button>
        </div>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-100 rounded-md">
          <h4 className="font-semibold text-yellow-800 text-sm sm:text-base">Review your order and address details to avoid cancellations</h4>
          <p className="text-yellow-700 text-xs sm:text-sm mt-2">
            <b>Note:</b> Please ensure your address and order details are correct. This order, if cancelled, is non-refundable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
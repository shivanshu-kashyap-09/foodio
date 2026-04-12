import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMinus, FaPlus, FaTrash, FaChevronRight, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

// 🔥 Skeleton Loader
const CartSkeleton = () => (
  <div className="mt-20 p-6 space-y-4">
    {[1, 2, 3].map((_, i) => (
      <div key={i} className="animate-pulse flex gap-4 items-center">
        <div className="w-16 h-16 bg-gray-300 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

const Cart = () => {
  const USER_ID = localStorage.getItem('user_id');
  const USER = JSON.parse(localStorage.getItem('user'));
  const API = import.meta.env.VITE_URL;

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState(USER?.user_address || "");
  const [phoneNumber, setPhoneNumber] = useState(USER?.user_phone || "");
  const [specialInstruction, setSpecialInstruction] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [deliveryCharge, setDeliveryCharge] = useState(50); // State for dynamic delivery fee
  const [borzoOrderDetails, setBorzoOrderDetails] = useState(null);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);


  // 🔥 map menu type → API
  const getMenuEndpoint = (type, id) => {
    const map = {
      veg: `/menus/${type}/${id}`,
      nonveg: `/menus/${type}/${id}`,
      southindian: `/menus/${type}/${id}`,
      thali: `/${type}/${id}`
    };
    return map[type];
  };

  // 🚀 fetch cart + hydrate data
  const handleGetCart = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/user/cart/${USER_ID}/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const items = res.data.data?.items || [];

      const cache = {};

      const detailedItems = await Promise.all(
        items.map(async (item) => {
          if (cache[item.dish_id]) {
            return { ...item, ...cache[item.dish_id] };
          }

          const endpoint = getMenuEndpoint(item.dish_type, item.dish_id);

          if (!endpoint) return item;

          try {
            const dishRes = await axios.get(`${API}${endpoint}`);
            const dish = dishRes.data.data;

            const formatted = {
              item_name: dish.dish_name || dish.thali_name || dish.name,
              item_price: parseFloat(dish.dish_price || dish.price),
              item_image: dish.dish_image || dish.thali_img || dish.image
            };

            cache[item.dish_id] = formatted;

            return { ...item, ...formatted };

          } catch (err) {
            console.error("Dish fetch error:", item.dish_id);
            return item;
          }
        })
      );

      setCartItems(detailedItems);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 delete item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/user/cart/${USER_ID}/cart/remove/${id}`);
      setCartItems(prev => prev.filter(i => i.cart_id !== id));
      toast.success("Item removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  // 🔥 quantity update
  const updateQuantity = async (id, quantity) => {
    try {
      await axios.put(`${API}/user/cart/${USER_ID}/cart/update/${id}`, { quantity }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setCartItems(prev =>
        prev.map(item =>
          item.cart_id === id ? { ...item, quantity } : item
        )
      );
      toast.success("Quantity updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const increase = (id, qty) => updateQuantity(id, qty + 1);
  const decrease = (id, qty) => qty > 1 && updateQuantity(id, qty - 1);

  // 💰 totals
  const itemTotal = cartItems.reduce(
    (t, i) => t + (i.item_price || 0) * i.quantity,
    0
  );

  // const delivery = 50;
  const gst = itemTotal * 0.05;
  const total = itemTotal + deliveryCharge + gst;
  const navigate = useNavigate();

  const handleOrder = async () => {
    // 🔥 Calculate Borzo Delivery Price before opening modal
    if (deliveryAddress && cartItems.length > 0) {
      await calculateBorzoDelivery();
    }
    setShowCheckoutModal(true);
  };

  const calculateBorzoDelivery = async () => {
    try {
      setIsCalculatingDelivery(true);
      const restaurantId = cartItems[0]?.restaurant_id;
      const restaurantType = cartItems[0]?.dish_type;
      
      // 1. Get Restaurant Address
      const restRes = await axios.get(`${API}/restaurants/${restaurantType}/${restaurantId}`);
      const restaurant = restRes.data.data;

      // 2. Call Borzo Calculate API
      const borzoRes = await axios.post(`${API}/delivery/borzo/calculate`, {
        points: [
          {
            address: restaurant.location || restaurant.restaurant_address,
            phone: restaurant.phone || restaurant.restaurant_phone,
            name: restaurant.name || restaurant.restaurant_name
          },
          {
            address: deliveryAddress,
            phone: phoneNumber,
            name: USER?.user_name
          }
        ]
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (borzoRes.data.success) {
        const fee = parseFloat(borzoRes.data.data.delivery_fee_amount);
        setDeliveryCharge(fee > 0 ? fee : 50);
        setBorzoOrderDetails(borzoRes.data.data);
      }
    } catch (err) {
      console.error("Borzo Calculation Error:", err);
      // Fallback to default
      setDeliveryCharge(50);
    } finally {
      setIsCalculatingDelivery(false);
    }
  };

  const confirmOrder = async () => {
    setShowCheckoutModal(false);
    if (paymentMethod === "cash") {
      await placeOrderAPI("cash");
    } else {
      await handleOnlinePayment();
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOnlinePayment = async () => {
    const loaded = await loadRazorpay();

    if (!loaded) {
      toast.error("Razorpay SDK failed to load. Check your connection.");
      return;
    }

    try {
      // 1. Create order on backend
      const { data: { data: order, keyId } } = await axios.post(`${API}/razorpay/create-order`, {
        amount: total,
        currency: "INR",
        notes: {
          user_id: USER_ID,
          items_count: cartItems.length
        }
      });

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "FOODIO",
        description: "Payment for your delicious meal",
        image: "https://cdn-icons-png.flaticon.com/512/3595/3595455.png",
        order_id: order.id,
        handler: async (response) => {
          try {
            // 2. Verify payment on backend
            const verifyRes = await axios.post(`${API}/razorpay/verify-payment`, response);

            if (verifyRes.data.success) {
              toast.success("Payment successful! 🎉");
              // 3. Place actual order in DB
              await placeOrderAPI("online");
            } else {
              toast.error("Payment verification failed. Contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Error verifying payment.");
          }
        },
        prefill: {
          name: USER?.user_name || "",
          email: USER?.user_gmail || "",
          contact: phoneNumber || ""
        },
        theme: {
          color: "#dc2626",
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment initialization error:", err);
      const msg = err.response?.data?.message || "Could not initialize payment.";
      toast.error(msg);
    }
  };

const placeOrderAPI = async (paymentType) => {
  try {
    const token = localStorage.getItem("token");

    const orderItems = cartItems.map(item => ({
      itemId: item.dish_id,
      quantity: item.quantity,
      price: item.item_price,
      dishType: item.dish_type
    }));

    const res = await axios.post(
      `${API}/user/orders/${USER_ID}/orders`,
      {
        restaurantId: cartItems[0]?.restaurant_id || 0,
        restaurantType: cartItems[0]?.dish_type || "",
        items: orderItems,
        totalAmount: total,
        deliveryAddress: deliveryAddress, // Using modal state
        phone: phoneNumber, // Using modal state
        specialInstructions: specialInstruction, // Using modal state
        paymentMethod: paymentType
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

      if (res.data.success || res.status === 201) {
        const orderId = res.data.data.orderId || res.data.data.id;
        
        toast.success("Order placed successfully 🎉");

        // 🚀 Create Borzo Delivery Order
        try {
          const restaurantId = cartItems[0]?.restaurant_id;
          const restaurantType = cartItems[0]?.dish_type;
          const restRes = await axios.get(`${API}/restaurants/${restaurantType}/${restaurantId}`);
          const restaurant = restRes.data.data;

          await axios.post(`${API}/delivery/borzo/create`, {
            orderData: {
              matter: `Order #FD-${orderId} - Foodio Delivery`,
              points: [
                {
                  address: restaurant.location || restaurant.restaurant_address,
                  contact_person: { phone: restaurant.phone || restaurant.restaurant_phone, name: restaurant.name || restaurant.restaurant_name },
                  note: "Pick up the food from the counter."
                },
                {
                  address: deliveryAddress,
                  contact_person: { phone: phoneNumber, name: USER?.user_name },
                  note: specialInstruction
                }
              ]
            }
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.info("Delivery partner assigned 🚚");
        } catch (borzoError) {
          console.error("Borzo Order Creation Error:", borzoError);
          toast.warning("Manual delivery assignment may be needed.");
        }

        // 🔥 clear cart
        try {
          await axios.delete(`${API}/user/cart/${USER_ID}/cart/clear`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (e) {
          console.error("Cart clear error", e);
        }

        setCartItems([]);
        
        // 🚀 Show Success UI then Navigate
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate(`/order/tracking/${orderId}`);
        }, 3000);
      }

  } catch (err) {
    console.error(err);
    toast.error("Order failed");
  }
};
  useEffect(() => {
    handleGetCart();
  }, []);

  // ⏳ loading UI
  if (loading) return <CartSkeleton />;

  // 🛒 empty cart
  if (cartItems.length === 0) {
    return (
      <div className="mt-20 text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/13637/13637462.png"
          className="w-40 mx-auto"
        />
        <h2 className="text-2xl font-bold mt-4">Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="mt-20 max-w-5xl mx-auto p-4">

      <h2 className="text-3xl font-bold mb-6 text-center text-red-700">
        Your Cart
      </h2>

      {/* 🛒 Items */}
      {cartItems.map(item => (
        <div key={item.cart_id} className="flex gap-4 items-center border-b py-4">

          <img
            src={item.item_image}
            alt={item.item_name}
            className="w-20 h-20 object-cover rounded"
          />

          <div className="flex-1">
            <h3 className="font-semibold">{item.item_name}</h3>
            <p className="text-green-600">₹{item.item_price}</p>
          </div>

          {/* 🔥 quantity control */}
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.8 }}
              onClick={() => decrease(item.cart_id, item.quantity)}
              className="bg-gray-200 p-2 rounded">
              <FaMinus />
            </motion.button>

            <motion.p
              key={item.quantity}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="font-bold"
            >
              {item.quantity}
            </motion.p>

            <motion.button whileTap={{ scale: 0.8 }}
              onClick={() => increase(item.cart_id, item.quantity)}
              className="bg-green-600 text-white p-2 rounded">
              <FaPlus />
            </motion.button>
          </div>

          {/* 🗑 delete */}
          <motion.button whileTap={{ scale: 0.8 }}
            onClick={() => handleDelete(item.cart_id)}
            className="text-red-600">
            <FaTrash />
          </motion.button>
        </div>
      ))}

      {/* 💰 Bill */}
      <div className="mt-6 border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Item Total</span>
          <span>₹{itemTotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span>₹{delivery}</span>
        </div>

        <div className="flex justify-between">
          <span>GST</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* 🚀 order button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleOrder}
        className="w-full mt-6 bg-red-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-3"
      >
        Proceed to Checkout <FaChevronRight className="text-sm" />
      </motion.button>

      {/* 🧾 Checkout Modal */}
      <AnimatePresence>
        {showCheckoutModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-red-600 p-8 text-white">
                <h2 className="text-2xl font-black mb-1 text-red-50">Checkout</h2>
                <p className="text-red-100/80 text-sm font-medium">Verify your details and choose payment</p>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* 📍 Delivery Details */}
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Delivery Address</label>
                    <textarea 
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all font-medium text-gray-700 min-h-[100px]"
                      placeholder="Enter your full address..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Mobile Number</label>
                    <input 
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all font-medium text-gray-700"
                      placeholder="Your 10-digit mobile number"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Special Instructions</label>
                    <textarea 
                      value={specialInstruction}
                      onChange={(e) => setSpecialInstruction(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all font-medium text-gray-700 min-h-[100px]"
                      placeholder="Any special instructions..."
                    />
                  </div>

                  {/* 💰 Order Summary */}
                  <div className="bg-orange-50/50 p-6 rounded-[2rem] border border-orange-100">
                    <h3 className="text-sm font-black text-orange-800 uppercase tracking-widest mb-4 flex items-center justify-between">
                      Order Summary <span>{cartItems.length} Items</span>
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-orange-900/70 font-bold">
                        <span>Subtotal</span>
                        <span>₹{itemTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-orange-900/70 font-bold">
                        <span>Delivery {isCalculatingDelivery ? '(Calculating...)' : '(Borzo)'}</span>
                        <span>₹{deliveryCharge.toFixed(2)}</span>
                      </div>
                      <div className="pt-3 mt-3 border-t border-orange-200/50 flex justify-between text-lg text-orange-900 font-black">
                        <span>To Pay</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 💳 Payment Options */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 block">Select Payment Method</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setPaymentMethod("cash")}
                        className={`p-6 rounded-[1.5rem] border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cash' ? 'border-red-600 bg-red-50' : 'border-gray-100 bg-gray-50 opacity-60'}`}
                      >
                        <span className="text-2xl">💵</span>
                        <span className={`text-xs font-black uppercase tracking-widest ${paymentMethod === 'cash' ? 'text-red-700' : 'text-gray-400'}`}>Cash</span>
                      </button>
                      <button 
                        onClick={() => setPaymentMethod("online")}
                        className={`p-6 rounded-[1.5rem] border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'online' ? 'border-red-600 bg-red-50' : 'border-gray-100 bg-gray-50 opacity-60'}`}
                      >
                        <span className="text-2xl">💳</span>
                        <span className={`text-xs font-black uppercase tracking-widest ${paymentMethod === 'online' ? 'text-red-700' : 'text-gray-400'}`}>Online</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 bg-gray-50 flex gap-4">
                <button 
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 py-4 text-gray-500 font-bold text-sm uppercase tracking-widest hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmOrder}
                  className="flex-3 bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-700 transition-all"
                >
                  Confirm & Pay ₹{total.toFixed(2)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎉 Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-12 text-center max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500" />
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-5xl"
                >
                  🎉
                </motion.span>
              </motion.div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Order Success!</h2>
              <p className="text-gray-500 font-medium">Your food is about to start its journey. Redirecting to tracking...</p>
              
              <div className="mt-8 flex justify-center gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                    className="w-3 h-3 bg-red-600 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
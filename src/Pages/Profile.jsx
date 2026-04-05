import React, { useEffect, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { FaTruck, FaBox, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const [order, setOrder] = useState([]);
  const [user, setUser] = useState({});
  const [editProfile, setEditProfile] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const navigate = useNavigate();
  const USER_ID = localStorage.getItem('user_id');
  const USER = JSON.parse(localStorage.getItem('user'));

  const handleOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/user/orders/${USER_ID}/orders`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (res.status === 200) setOrder(res.data.data || []);
    } catch (error) {
      // toast.error("Failed to fetch orders!");
      console.error(error);
    }
  };

  const handleUser = async () => {
    try {
      if (!USER_ID) {
        toast.error("User not logged in!");
        navigate('/login');
        return;
      }
      const res = await axios.get(`${import.meta.env.VITE_URL}/user/profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.status === 200) {
        setUser(res.data.data);
        localStorage.setItem('user', JSON.stringify(res.data.data));
        localStorage.setItem('user_id', res.data.data.id);
      }
    } catch (error) {
      // toast.error("Failed to fetch user profile!");
      console.error(error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('user_name', user.user_name || '');
      formData.append('user_phone', user.user_phone || '');
      formData.append('user_gmail', user.user_gmail || '');
      formData.append('user_address', user.user_address || '');
      if (user.user_img instanceof File) {
        formData.append('user_img', user.user_img);
      }
      const res = await axios.put(
        `${import.meta.env.VITE_URL}/user/update/profile`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (res.status === 200) {
        toast.success("Profile updated successfully!");
        setEditProfile(false);
        setEditAddress(false);
        handleUser();
      }
    } catch (err) {
      // toast.error("Failed to update profile.");
      console.error(err);
    }
  };

  const handleCancelOrder = async (order_id) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_URL}/user/orders/${USER_ID}/orders/${order_id}/cancel`);
      if (res.status === 200) {
        toast.success("Order cancelled successfully!");
        handleOrders();
      }
    } catch (error) {
      toast.error("Failed to cancel order.");
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  useEffect(() => {
    handleUser();
    handleOrders();
  }, []);

  const renderImage = () => {
    if (user.user_img instanceof File) {
      return URL.createObjectURL(user.user_img);
    }
    if (typeof user.user_img === 'string') {
      return user.user_img.startsWith('http')
        ? user.user_img
        : `${import.meta.env.VITE_URL}${user.user_img}`;
    }
    return "https://static.vecteezy.com/system/resources/previews/002/002/403/non_2x/man-with-beard-avatar-character-isolated-icon-free-vector.jpg";
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-22 pb-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white shadow-2xl rounded-[2.5rem] p-8 sm:p-10 w-full md:w-1/2 border border-gray-50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-pink-600" />
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-red-700 mb-6 sm:mb-8">My Profile</h2>
        <motion.button
          whileHover={{ rotate: 90 }}
          onClick={() => setEditProfile(!editProfile)}
          className="absolute top-10 right-10 text-red-600 hover:text-red-700 bg-red-50 p-3 rounded-2xl transition-all"
          title="Edit Profile"
        >
          <FaEdit size={20} />
        </motion.button>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border-b pb-4 sm:pb-6 mb-4 sm:mb-6">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48">
            <img
              src={renderImage()}
              alt="profile"
              className="w-full h-full rounded-full object-cover border border-gray-300 shadow-md"
            />
            {editProfile && (
              <>
                <input
                  type="file"
                  id="profileImg"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setUser({ ...user, user_img: e.target.files[0] })}
                />
                <label
                  htmlFor="profileImg"
                  className="absolute bottom-1 right-1 bg-white border border-gray-300 rounded-full p-1 sm:p-2 cursor-pointer shadow hover:bg-gray-100 transition"
                  title="Change Profile Image"
                >
                  <FaEdit className="text-red-600" size={14} sm:size={16} />
                </label>
              </>
            )}
          </div>
          <div className="space-y-2 w-full text-center sm:text-left">
            {editProfile ? (
              <>
                <input
                  type="text"
                  value={user.user_name || ''}
                  onChange={(e) => setUser({ ...user, user_name: e.target.value })}
                  className="w-full border rounded px-3 py-1 text-sm sm:text-base"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={user.user_phone || ''}
                  onChange={(e) => setUser({ ...user, user_phone: e.target.value })}
                  className="w-full border rounded px-3 py-1 text-sm sm:text-base"
                  placeholder="Phone"
                />
                <input
                  type="email"
                  value={user.user_gmail || ''}
                  onChange={(e) => setUser({ ...user, user_gmail: e.target.value })}
                  className="w-full border rounded px-3 py-1 text-sm sm:text-base"
                  placeholder="Email"
                />
              </>
            ) : (
              <>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{user.user_name}</h3>
                <p className="text-gray-600 text-sm sm:text-base">+91 {user.user_phone}</p>
                <p className="text-gray-600 text-sm sm:text-base">{user.user_gmail}</p>
                <p className={`text-xs sm:text-sm ${user.user_verify ? 'text-green-600' : 'text-red-600'}`}>
                  {user.user_verify ? "Verified" : "Not Verified"}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="mb-4 sm:mb-6 relative">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Address</h3>
          <button
            onClick={() => setEditAddress(!editAddress)}
            className="absolute top-0 right-0 text-red-700 hover:text-red-900"
            title="Edit Address"
          >
            <FaEdit size={22} sm:size={18} />
          </button>
          {editAddress ? (
            <textarea
              rows={3}
              value={user.user_address || ''}
              onChange={(e) => setUser({ ...user, user_address: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm sm:text-base"
              placeholder="Address"
            />
          ) : (
            <p className="text-gray-600 text-sm sm:text-base">{user.user_address || "No address added."}</p>
          )}
        </div>
        <div className="flex justify-center gap-3 sm:gap-4">
          {(editProfile || editAddress) && (
            <button
              onClick={handleSaveChanges}
              className="w-24 sm:w-28 py-1.5 sm:py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition text-sm sm:text-base"
            >
              Save
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-24 sm:w-28 py-1.5 sm:py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </motion.div>
      <div className="w-full md:w-1/2 space-y-6">
        <div className="bg-white shadow-xl rounded-[2.5rem] p-8 border border-gray-50 h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-gray-900">My Orders</h2>
            <div className="bg-red-50 text-red-600 px-4 py-1.5 rounded-2xl font-bold text-xs uppercase tracking-wider">
              {order.length} Total
            </div>
          </div>

          {order.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <img
                src="https://cdn-icons-png.flaticon.com/512/13637/13637462.png"
                alt="empty orders"
                className="w-40 h-40 opacity-20 grayscale mb-6"
              />
              <p className="text-gray-400 font-bold">No orders found</p>
              <Link to="/" className="mt-4 text-red-600 font-black text-sm uppercase tracking-widest hover:underline">Start Ordering</Link>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {order.map((item) => {
                const isActive = !['delivered', 'cancelled'].includes(item.status?.toLowerCase());
                return (
                  <motion.div 
                    key={item.id}
                    whileHover={{ y: -5 }}
                    className={`p-6 rounded-3xl border-2 transition-all ${isActive ? 'border-red-100 bg-red-50/30 shadow-red-50' : 'border-gray-50 bg-white hover:border-gray-100'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isActive ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <FaBox />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order #FD-{item.id}</p>
                          <h4 className="font-bold text-gray-900">{item.items || 'Delicious Food'}</h4>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tighter border ${item.status === "Delivered" ? "bg-green-50 text-green-600 border-green-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-200">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</p>
                        <p className="font-black text-gray-900 text-lg">₹{item.total_amount}</p>
                      </div>
                      <div className="flex gap-2">
                        {item.status?.toLowerCase() === 'pending' && (
                          <button
                            onClick={() => handleCancelOrder(item.id)}
                            className="bg-white border-2 border-red-100 text-red-500 p-3 rounded-2xl hover:bg-red-50 transition-colors"
                            title="Cancel"
                          >
                            <FaXmark />
                          </button>
                        )}
                        <Link
                          to={`/order/tracking/${item.id}`}
                          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isActive ? 'bg-red-600 text-white shadow-lg shadow-red-100 hover:bg-red-700' : 'bg-gray-900 text-white hover:bg-black'}`}
                        >
                          {isActive ? <><FaTruck /> Track</> : 'View Details'}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
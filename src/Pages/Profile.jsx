import React, { useEffect, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [order, setOrder] = useState([]);
  const [user, setUser] = useState({});
  const [editProfile, setEditProfile] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const navigate = useNavigate();
  const USER_ID = localStorage.getItem('user_id');

  const handleOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/order/get/${USER_ID}`);
      if (res.status === 200) setOrder(res.data);
    } catch (error) {
      toast.error("Failed to fetch orders!");
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

      const res = await axios.get(`${import.meta.env.VITE_URL}/user/get/${USER_ID}`);
      if (res.status === 200) setUser(res.data);
    } catch (error) {
      toast.error("Failed to fetch user profile!");
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
        `${import.meta.env.VITE_URL}/user/update/${USER_ID}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.status === 200) {
        toast.success("Profile updated successfully!");
        setEditProfile(false);
        setEditAddress(false);
        handleUser();
      }
    } catch (err) {
      toast.error("Failed to update profile.");
      console.error(err);
    }
  };

  const handleCancelOrder = async (order_id) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_URL}/order/update/${USER_ID}/${order_id}`, {
        delivery_status: "Cancelled"
      });
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
    <div className='min-h-screen bg-gray-100 p-6 md:p-10 grid md:grid-cols-2 gap-10 mt-15'>

      {/* Profile Section */}
      <div className='bg-white shadow-lg rounded-xl p-8 relative'>
        <h2 className='text-3xl font-bold text-center text-red-700 mb-8'>My Profile</h2>

        {/* Edit Icon */}
        <button
          onClick={() => setEditProfile(!editProfile)}
          className="absolute top-4 right-4 text-red-700 hover:text-red-900"
          title="Edit Profile"
        >
          <FaEdit size={20} />
        </button>

        <div className='flex items-center gap-6 border-b pb-6 mb-6'>
          {/* Profile Image */}
          <div className="relative w-64 h-44">
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
                  onChange={(e) =>
                    setUser({ ...user, user_img: e.target.files[0] })
                  }
                />
                <label
                  htmlFor="profileImg"
                  className="absolute bottom-1 right-1 bg-white border border-gray-300 rounded-full p-2 cursor-pointer shadow hover:bg-gray-100 transition"
                  title="Change Profile Image"
                >
                  <FaEdit className="text-red-600" size={16} />
                </label>
              </>
            )}
          </div>

          {/* User Details */}
          <div className='space-y-2 w-full'>
            {editProfile ? (
              <>
                <input
                  type="text"
                  value={user.user_name || ''}
                  onChange={(e) => setUser({ ...user, user_name: e.target.value })}
                  className="w-full border rounded px-3 py-1"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={user.user_phone || ''}
                  onChange={(e) => setUser({ ...user, user_phone: e.target.value })}
                  className="w-full border rounded px-3 py-1"
                  placeholder="Phone"
                />
                <input
                  type="email"
                  value={user.user_gmail || ''}
                  onChange={(e) => setUser({ ...user, user_gmail: e.target.value })}
                  className="w-full border rounded px-3 py-1"
                  placeholder="Email"
                />
              </>
            ) : (
              <>
                <h3 className='text-xl font-semibold text-gray-800'>{user.user_name}</h3>
                <p className='text-gray-600'>+91 {user.user_phone}</p>
                <p className='text-gray-600'>{user.user_gmail}</p>
                <p className={`text-sm ${user.user_verify ? 'text-green-600' : 'text-red-600'}`}>
                  {user.user_verify ? "Verified" : "Not Verified"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className='mb-6 relative'>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>Address</h3>
          <button
            onClick={() => setEditAddress(!editAddress)}
            className="absolute top-0 right-0 text-red-700 hover:text-red-900"
            title="Edit Address"
          >
            <FaEdit size={18} />
          </button>

          {editAddress ? (
            <textarea
              rows={3}
              value={user.user_address || ''}
              onChange={(e) => setUser({ ...user, user_address: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="Address"
            />
          ) : (
            <p className='text-gray-600'>{user.user_address}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {(editProfile || editAddress) && (
            <button
              onClick={handleSaveChanges}
              className="w-32 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition"
            >
              Save
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-32 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <div className='bg-white shadow-lg rounded-xl p-8'>
        <h2 className='text-3xl font-bold text-center text-red-700 mb-8'>My Orders</h2>

        {order.length === 0 ? (
          <div className="flex justify-center items-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/13637/13637462.png"
              alt="empty orders"
              className="w-64 h-64 object-contain"
            />
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden">
            <div className='grid grid-cols-6 bg-red-500 text-white font-semibold py-3 px-4 text-sm'>
              <p className='text-center'>Order ID</p>
              <p className='text-center'>Items</p>
              <p className='text-center'>Payment</p>
              <p className='text-center'>Total</p>
              <p className='text-center'>Status</p>
              <p className='text-center'>Action</p>
            </div>

            {order.map((item) => (
              <div key={item.order_id} className="grid grid-cols-6 items-center border-b px-4 py-4 hover:bg-gray-50 transition text-sm">
                <p className='text-center font-semibold text-red-700'>{item.order_id}</p>
                <p className="text-gray-700 ml-10">{item.items}</p>
                <p className="text-green-700 font-medium text-center">{item.payment}</p>
                <p className="text-blue-700 font-medium text-center">₹{item.total}</p>
                <p className={`text-center font-medium ${item.delivery_status === "Delivered" ? "text-green-600" : "text-yellow-600"}`}>
                  {item.delivery_status}
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    title="Cancel Order"
                    className={`p-2 rounded-full transition 
                      ${item.delivery_status?.toLowerCase() === 'panding' || item.delivery_status?.toLowerCase() === 'pending'
                        ? 'bg-red-100 hover:bg-red-200 text-red-700 cursor-pointer'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    disabled={item.delivery_status?.toLowerCase() !== 'panding' && item.delivery_status?.toLowerCase() !== 'pending'}
                    onClick={() => handleCancelOrder(item.order_id)}
                  >
                    <FaXmark />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

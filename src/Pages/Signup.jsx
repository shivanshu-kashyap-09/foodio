import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEyeSlash, FaPhone } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    userPassword: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (form.userPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/user/signup`, {
        userName: form.userName,
        userEmail: form.userEmail,
        userPhone: form.userPhone,
        userPassword: form.userPassword,
      });

      if (response.status === 201) {
        toast.success("Signup successful! Check email for verification.");
        navigate("/login");
      }
    } catch (err) {
      toast.error("Signup failed: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-red-900 font-bold text-3xl text-center">FOODIO</h2>
        <h3 className="text-xl font-semibold text-center mb-4">Create your account</h3>

        <form onSubmit={handleSubmit}>
          <div className="border rounded-full px-4 py-2 mb-4 bg-gray-50">
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              placeholder="Enter Name"
              className="bg-transparent outline-none w-full"
              required
            />
          </div>

          <div className="flex items-center border rounded-full px-4 py-2 mb-4 bg-gray-50">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              name="userEmail"
              value={form.userEmail}
              onChange={handleChange}
              placeholder="Enter Email"
              className="bg-transparent outline-none w-full"
              required
            />
          </div>

          <div className="flex items-center border rounded-full px-4 py-2 mb-4 bg-gray-50">
            <FaPhone className="text-gray-400 mr-2" />
            <input
              type="tel"
              name="userPhone"
              value={form.userPhone}
              onChange={handleChange}
              placeholder="Enter Phone"
              className="bg-transparent outline-none w-full"
              required
            />
          </div>

          <div className="flex items-center border rounded-full px-4 py-2 mb-4 bg-gray-50">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="userPassword"
              value={form.userPassword}
              onChange={handleChange}
              placeholder="Enter Password"
              className="bg-transparent outline-none w-full"
              required
            />
            <FaEyeSlash className="text-gray-400 cursor-pointer" />
          </div>

          <div className="flex items-center border rounded-full px-4 py-2 mb-4 bg-gray-50">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="bg-transparent outline-none w-full"
              required
            />
            <FaEyeSlash className="text-gray-400 cursor-pointer" />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition mb-4"
          >
            Sign up
          </button>
        </form>

        <div className="text-center mb-4">
            <a
              href={`${import.meta.env.VITE_URL}/auth/googleoauth2`}
              className="inline-flex items-center gap-2 text-sm font-medium border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100"
            >
              <img
                src="https://foodivapp.s3-ap-south-1.amazonaws.com/1744197002googlepng.png"
                alt="Google"
                width="20"
                height="20"
              />
              Continue with Google
            </a>
          </div>


        <div className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

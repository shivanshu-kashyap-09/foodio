import axios from 'axios';
import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEyeSlash } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [user, setUer] = useState([]);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleUser = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/user/login`, {
        userName,
        password
      })
      console.log(response);
      
      if (response.status == 200) {
        toast.success("Login Successfully");
        setUer(response.body);
        localStorage.setItem("user", JSON.stringify(user));
        Navigate('/');
      }
    } catch (error) {
      toast.error("user name or password is wrong.")
      console.error(error);
    }
  }
  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          {/* <img
              className="mx-auto mb-4"
              src="https://manage.foodiv.com/public/images/logo/logo.svg"
              width="150"
              alt="Logo"
            /> */}
          {/* <img src={logo} alt="logo" className="h-40 w-40" /> */}
          <h2 className='text-red-900 font-bold text-3xl px-2'>FOODIO</h2>
          <h3 className="text-xl font-semibold mb-4">Sign in to your account</h3>
        </div>

        {/* Login Form */}
        <form id="login_form" autoComplete="off">
          <input type="hidden" name="_token" value="TOKEN_HERE" />
          <input type="hidden" name="country_code" id="country_code" value="+91" />

          {/* Email Field */}
          <div className="flex items-center border rounded-full px-4 py-2 mb-4 bg-gray-50">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="text"
              className="bg-transparent outline-none w-full"
              name="email"
              placeholder="Enter email / phone number"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center border rounded-full px-4 py-2 mb-4 bg-gray-50">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              className="bg-transparent outline-none w-full"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
            <FaEyeSlash className="text-gray-400 cursor-pointer" />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="w-full py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition mb-4"
            id="sign_in_btn"
            onClick={handleUser}
          >
            Sign in
          </button>

          <hr className="my-4" />

          {/* Social Login */}
          <div className="text-center mb-4">
            <a
              href="https://manage.foodiv.com/social/auth/google"
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

          {/* Links */}
          <div className="text-sm text-center space-y-1">
            <a href="/forget-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </a>
            <p>
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;

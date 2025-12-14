import axios from 'axios';
import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEyeSlash } from 'react-icons/fa';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [userValue, setUserValue] = useState('');
  const [password, setPassword] = useState('');

  const handleUser = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/user/login`, {
        user: userValue,
        password: password,
      });

      const { result, token } = response.data;
      if (response.status === 200) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", token); 
        localStorage.setItem("user_id", result.user_id);
        localStorage.setItem("user", JSON.stringify(result));

        setUser(result);

        toast.success("Login Successfully");
        navigate('/');
      }

    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 403) {
          toast.error("User is not verified.");
        } else if (status === 401) {
          toast.error("Invalid credentials.");
        } else {
          toast.error("Server error occurred.");
        }
      } else {
        toast.error("Network error. Please try again.");
      }
      console.error(error);
    }
  };


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
              value={userValue}
              onChange={(e) => setUserValue(e.target.value)}
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

          {/* Links */}
          <div className="text-sm text-center space-y-1">
            <Link to="/forget-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;

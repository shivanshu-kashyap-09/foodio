import React from 'react';
import { FaEnvelope, FaLock, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-red-900 font-bold text-3xl px-2">FOODIO</h2>
          <h3 className="text-xl font-semibold mb-4">Create your account</h3>
        </div>

        <form method="POST" autoComplete="off" noValidate>
          <input type="hidden" name="_token" value="0Fp3nd3Ah9veZ7P7T9B7QnpYgjbQauxiz4PJMIDB" />
          <input type="hidden" name="country_code" value="+91" />
          <input type="hidden" name="iso2" value="IN" />
          <small className="text-red-600 block" id="mobile_error"></small>

          {/* Email */}
          <div className="flex items-center border rounded-full px-4 py-2 mb-4 bg-gray-50">
            <FaEnvelope className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              placeholder="Enter Mail Address"
              className="bg-transparent outline-none w-full"
            />
          </div>
          <small className="text-red-600 block mb-2" id="email_error"></small>

          {/* Password */}
          <div className="flex items-center border rounded-full px-4 py-2 mb-4 bg-gray-50">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="bg-transparent outline-none w-full"
            />
            <FaEyeSlash className="text-gray-400 cursor-pointer" />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center border rounded-full px-4 py-2 mb-4 bg-gray-50">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              className="bg-transparent outline-none w-full"
            />
            <FaEyeSlash className="text-gray-400 cursor-pointer" />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition mb-4"
            id="register_btn"
          >
            Sign up
          </button>
          <label id="genaral-error" className="text-red-600 hidden"></label>

          <hr className="my-4" />

          {/* Google Login */}
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
          <div className="text-sm text-center">
            <p>
              Already have an account?{' '}
              <a href="/login" className="text-blue-500 hover:underline">
                Log In
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

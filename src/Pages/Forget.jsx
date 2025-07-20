import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Forget = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
   const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/user/forget-password`, { email });
      if (response.status === 200) {
        toast.success("OTP sent to your email!");
        setShowOtpForm(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 5) {
      toast.error("Please enter a valid 5-digit OTP.");
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/user/verify-otp`, { email, otp: otpValue });
      if (response.status === 200) {
        toast.success("OTP verified successfully!");
        setShowOtpForm(false);
        setShowPasswordForm(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
      console.error(error);
    }
  };

  const handleChangePassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/user/reset-password`, { email, password });
      if (response.status === 200) {
        toast.success("Password reset successfully! Please log in.");
        setShowPasswordForm(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setOtp(['', '', '', '', '']);
        navigate('/login')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
      console.error(error);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 4) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-red-900 font-bold text-2xl sm:text-3xl md:text-4xl px-2 mb-2 sm:mb-4">FOODIO</h2>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">Forgot Password</h3>
        </div>
        {!showOtpForm && !showPasswordForm && (
          <form id="forgot_password_form" className="space-y-3 sm:space-y-4">
            <input type="hidden" name="is_email" value="1" />
            <input type="hidden" name="country_code" value="+91" />
            <div className="flex items-center border rounded-full px-3 sm:px-4 py-2 bg-gray-50">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Mail Address"
                autoComplete="off"
                className="w-full bg-transparent outline-none text-sm sm:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="button"
              id="send_code"
              className="w-full bg-red-600 text-white py-2 rounded-full font-semibold hover:bg-red-700 transition text-sm sm:text-base md:text-lg"
              onClick={handleSendOtp}
            >
              Submit
            </button>
            <p className="text-center text-xs sm:text-sm mt-2">
              You already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log In
              </Link>
            </p>
          </form>
        )}
        {showOtpForm && (
          <form id="otp_varification_email_form" className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <div className="flex justify-between gap-2 sm:gap-3">
              {[0, 1, 2, 3, 4].map((index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center border border-gray-300 rounded-md text-sm sm:text-base"
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                />
              ))}
            </div>
            <p className="text-xs sm:text-sm">
              Note: If you haven’t received the OTP, please check your <strong>spam</strong> or{' '}
              <strong>junk</strong> folder.
            </p>
            <p className="text-xs sm:text-sm text-center">
              Resend OTP in <span id="count_otp">00:46</span> seconds
            </p>
            <button
              type="button"
              id="verify_otp"
              className="w-full bg-red-600 text-white py-2 rounded-full font-semibold hover:bg-red-700 transition text-sm sm:text-base md:text-lg"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </form>
        )}
        {showPasswordForm && (
          <form id="password_set_form" className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
            <input
              type="password"
              name="password"
              placeholder="Enter New Password"
              autoComplete="off"
              className="w-full border px-3 sm:px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              autoComplete="off"
              className="w-full border px-3 sm:px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              id="change_pass"
              className="w-full bg-red-600 text-white py-2 rounded-full font-semibold hover:bg-green-700 transition text-sm sm:text-base md:text-lg"
              onClick={handleChangePassword}
            >
              Change Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Forget;
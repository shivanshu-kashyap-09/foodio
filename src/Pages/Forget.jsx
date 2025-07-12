import React, { useState } from 'react';

const Forget = () => {
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          {/* <a href="/login">
            <img
              src="https://manage.foodiv.com/public/images/logo/logo.svg"
              alt="Foodiv Logo"
              className="mx-auto mb-3 w-36"
            />
          </a> */}
          <h2 className='text-red-900 font-bold text-3xl px-2'>FOODIO</h2>
          <h3 className="text-xl font-semibold">Forgot Password</h3>
        </div>

        {/* Main Forgot Password Form */}
        <form id="forgot_password_form" className="space-y-4">
          <input type="hidden" name="is_email" value="1" />
          <input type="hidden" name="country_code" value="+91" />

          {/* Email Field */}
          <div className="flex items-center border rounded-full px-4 py-2 bg-gray-50">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Mail Address"
              autoComplete="off"
              className="w-full bg-transparent outline-none"
            />
          </div>
          <label id="mobile_error" className="text-red-500 hidden text-sm"></label>

          {/* Captcha Placeholder */}
          <div id="captcha_div" className="text-left hidden">
            <div id="recaptcha-container" data-callback="recaptchaCallback"></div>
            <label id="recaptcha_error" className="text-red-500 text-sm mt-1 block"></label>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            id="send_code"
            className="w-full bg-red-600 text-white py-2 rounded-full font-semibold hover:bg-red-700 transition"
            onClick={() => setShowOtpForm(true)}
          >
            Submit
          </button>

          <p className="text-center text-sm mt-2">
            You already have an account?{' '}
            <a href="/login" className="text-blue-600 underline">
              Log In
            </a>
          </p>
        </form>

        {/* OTP Verification Form */}
        {showOtpForm && (
          <form id="otp_varification_email_form" className="mt-6 space-y-4">
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((box) => (
                <input
                  key={box}
                  type="text"
                  maxLength={1}
                  className="w-10 h-10 text-center border border-gray-300 rounded-md"
                />
              ))}
            </div>

            <label id="verification_error" className="text-red-500 text-sm block"></label>
            <label id="verification_success" className="text-green-500 text-sm block"></label>

            <p className="text-sm">
              Note: If you haven’t received the OTP, please check your <strong>spam</strong> or{' '}
              <strong>junk</strong> folder.
            </p>
            <p className="text-sm text-center">
              Resend OTP in <span id="count_otp">00:46</span> seconds
            </p>

            <button
              type="button"
              id="verify_otp"
              className="w-full bg-red-600 text-white py-2 rounded-full font-semibold hover:bg-red-700 transition"
              onClick={() => setShowPasswordForm(true)}
            >
              Verify OTP
            </button>
          </form>
        )}

        {/* Set New Password Form */}
        {showPasswordForm && (
          <form id="password_set_form" className="mt-6 space-y-4">
            <input
              type="password"
              name="password"
              placeholder="Enter New Password"
              autoComplete="off"
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              autoComplete="off"
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <label id="password_error" className="text-red-500 text-sm block"></label>

            <button
              type="button"
              id="change_pass"
              className="w-full bg-green-600 text-white py-2 rounded-full font-semibold hover:bg-green-700 transition"
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

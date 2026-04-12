import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEyeSlash, FaEye, FaArrowRight, FaSignInAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [userValue, setUserValue] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleUser = async () => {
        if (!userValue || !password) {
            toast.warning("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_URL}/user/login`, {
                user: userValue,
                password: password,
            });

            if (response.status === 200) {
                const { token, user } = response.data.data;
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("token", token);
                localStorage.setItem("user_id", user.id);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("role", user.role);

                toast.success("Login Successful! Welcome back.");
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (status === 403) {
                    toast.error("User is not verified. Please check your email.");
                } else if (status === 401) {
                    toast.error("Invalid credentials. Please try again.");
                } else {
                    toast.error(data?.message || "Server error occurred.");
                }
            } else {
                toast.error("Network error. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 relative overflow-hidden mt-15">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-50 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 opacity-60"></div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-2xl bg-white shadow-2xl shadow-red-100 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row border border-red-50"
            >
                {/* Left Side - Visual/Branding (Matches Signup) */}
                <div className="w-full md:w-5/12 bg-gradient-to-br from-red-600 to-red-700 p-8 text-white flex flex-col justify-between items-start">
                    <div>
                        <motion.h2
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl font-black tracking-tighter mb-2"
                        >
                            FOODIO
                        </motion.h2>
                        <p className="text-red-100 text-sm font-medium leading-relaxed">
                            Welcome back to your ultimate food companion. Deliciousness is just a sign-in away.
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                            <p className="text-xs font-bold uppercase tracking-widest text-red-100 mb-2">Member Perks</p>
                            <ul className="text-xs space-y-1 text-red-50 font-medium">
                                <li>• Priority delivery on all orders</li>
                                <li>• Exclusive member-only deals</li>
                                <li>• Earn loyalty points faster</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-7/12 p-8 md:p-10">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Welcome Back!</h1>
                        <p className="text-gray-500 text-sm">Please sign in to continue enjoying FOODIO.</p>
                    </div>

                    <form className="space-y-6" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-4">
                            <motion.div variants={itemVariants} className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-300 group-focus-within:text-red-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="email"
                                    value={userValue}
                                    onChange={(e) => setUserValue(e.target.value)}
                                    placeholder="Email or Phone Number"
                                    className="block w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaLock className="text-gray-300 group-focus-within:text-red-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Your Password"
                                    className="block w-full pl-11 pr-11 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </motion.div>

                            <div className="flex justify-end pr-2">
                                <Link to="/forget-password" onClick={(e) => { e.preventDefault(); navigate('/forget-password'); }} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handleUser}
                            disabled={isLoading}
                            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:shadow-none"
                        >
                            {isLoading ? "Signing in..." : (
                                <>
                                    Sign In <FaSignInAlt className="text-sm" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-10 text-center space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-3 text-gray-400 font-bold tracking-tighter">Or log in with</span>
                            </div>
                        </div>

                        <motion.a
                            variants={itemVariants}
                            href={`${import.meta.env.VITE_URL}/user/googleoauth2`}
                            className="w-full inline-flex items-center justify-center gap-3 py-3.5 border-2 border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors text-sm font-bold text-gray-600"
                        >
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            Google Account
                        </motion.a>

                        <p className="text-sm font-semibold text-gray-500">
                            Don't have an account yet?{" "}
                            <Link to="/signup" className="text-red-600 hover:text-red-700 font-black">SIGN UP</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;


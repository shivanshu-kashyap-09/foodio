import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaEyeSlash, FaPhone, FaUser, FaShieldAlt, FaTruck, FaEye, FaArrowRight, FaUtensils, FaBox } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [form, setForm] = useState({
        userName: '',
        userEmail: '',
        userPhone: '',
        userPassword: '',
        confirmPassword: '',
        userRole: 'user', // Default to user
        restaurantType: 'veg', // Default for restaurant
        address: '',
        vehicle_type: '',
        vehicle_number: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const roles = [
        { id: 'user', title: 'Customer', icon: <FaUser />, desc: 'Order delicious food' },
        { id: 'restaurant', title: 'Restaurant', icon: <FaUtensils />, desc: 'Grow your business' },
        { id: 'delivery', title: 'Delivery', icon: <FaTruck />, desc: 'Earn by delivering' },
    ];

    const restaurantTypes = [
        { id: 'veg', title: 'Veg', icon: <FaBox className="text-green-500" /> },
        { id: 'nonveg', title: 'Non-Veg', icon: <FaBox className="text-red-500" /> },
        { id: 'southindian', title: 'South Indian', icon: <FaBox className="text-orange-500" /> }
    ];

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRoleSelect = (roleId) => {
        setForm(prev => ({ ...prev, userRole: roleId }));
    };

    const handleTypeSelect = (typeId) => {
        setForm(prev => ({ ...prev, restaurantType: typeId }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (isLoading) return;

        if (form.userPassword !== form.confirmPassword) {
            toast.warning("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_URL}/user/signup`, {
                userName: form.userName,
                userEmail: form.userEmail,
                userPhone: form.userPhone,
                userPassword: form.userPassword,
                userConfirmPassword: form.confirmPassword,
                userRole: form.userRole,
                restaurantType: form.userRole === 'restaurant' ? form.restaurantType : null,
                address: form.address,
                vehicle_type: form.userRole === 'delivery' ? form.vehicle_type : null,
                vehicle_number: form.userRole === 'delivery' ? form.vehicle_number : null
            });

            if (response.status === 201) {
                toast.success("Welcome aboard! Please verify your email.");
                navigate("/login");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data || "Something went wrong. Please try again.";
            toast.error(errorMsg);
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
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 py-12 relative overflow-hidden mt-12">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-red-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-60"></div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-2xl bg-white shadow-2xl shadow-red-100 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row border border-red-50"
            >
                {/* Left Side - Visual/Branding */}
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
                            Join our community of food lovers and partners. Experience the future of food delivery.
                        </p>
                    </div>

                    <div className="hidden md:block">
                        <div className="flex -space-x-3 mb-4">
                            {[1, 2, 3, 4].map(i => (
                                <img
                                    key={i}
                                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                    className="w-8 h-8 rounded-full border-2 border-red-500 shadow-lg"
                                    alt="User"
                                />
                            ))}
                            <div className="w-8 h-8 rounded-full bg-red-800 border-2 border-red-500 flex items-center justify-center text-[10px] font-bold">
                                +2k
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-red-100 uppercase tracking-widest">Trusted by thousands</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-7/12 p-8 md:p-10">
                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Create Account</h1>
                        <p className="text-gray-500 text-sm font-bold tracking-tight uppercase">Ready to join the revolution?</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role Selection */}
                        <div className="space-y-3 mb-6">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">1. Select Your Role</label>
                            <div className="grid grid-cols-3 gap-2">
                                {roles.map((role) => (
                                    <motion.div
                                        key={role.id}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleRoleSelect(role.id)}
                                        className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1 ${form.userRole === role.id
                                                ? 'border-red-500 bg-red-50 text-red-600'
                                                : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-red-100'
                                            }`}
                                    >
                                        <div className="text-xl">{role.icon}</div>
                                        <span className="text-[9px] font-black uppercase tracking-tighter">{role.title}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Restaurant Type Sub-selection */}
                        <AnimatePresence>
                            {form.userRole === 'restaurant' && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="space-y-3 mb-6 overflow-hidden"
                                >
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">2. Restaurant Type</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {restaurantTypes.map((type) => (
                                            <motion.div
                                                key={type.id}
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleTypeSelect(type.id)}
                                                className={`cursor-pointer p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1 ${form.restaurantType === type.id
                                                        ? 'border-red-500 bg-red-50 text-red-600 shadow-sm'
                                                        : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-red-100'
                                                    }`}
                                            >
                                                <div className="text-xl">{type.icon}</div>
                                                <span className="text-[9px] font-black uppercase tracking-tighter">{type.title}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 gap-3">
                            <motion.div variants={itemVariants} className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaUser className="text-gray-300 group-focus-within:text-red-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="userName"
                                    value={form.userName}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaEnvelope className="text-gray-300 group-focus-within:text-red-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="userEmail"
                                    value={form.userEmail}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
                                    required
                                />
                            </motion.div>

                            <motion.div variants={itemVariants} className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FaPhone className="text-gray-300 group-focus-within:text-red-500 transition-colors" />
                                </div>
                                <input
                                    type="tel"
                                    name="userPhone"
                                    value={form.userPhone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
                                    required
                                />
                            </motion.div>

                            {(form.userRole === 'restaurant' || form.userRole === 'delivery') && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }}
                                    className="relative group"
                                >
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaUtensils className="text-gray-300 group-focus-within:text-red-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder={form.userRole === 'restaurant' ? "Restaurant Full Address" : "Delivery Hub/Pin Location"}
                                        className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
                                        required
                                    />
                                </motion.div>
                            )}

                            {form.userRole === 'delivery' && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} 
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                >
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaTruck className="text-gray-300 group-focus-within:text-red-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            name="vehicle_type"
                                            value={form.vehicle_type}
                                            onChange={handleChange}
                                            placeholder="Vehicle Type (e.g., Bike)"
                                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
                                            required
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaBox className="text-gray-300 group-focus-within:text-red-500 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            name="vehicle_number"
                                            value={form.vehicle_number}
                                            onChange={handleChange}
                                            placeholder="Vehicle Number"
                                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <motion.div variants={itemVariants} className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-300 group-focus-within:text-red-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="userPassword"
                                        value={form.userPassword}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        className="block w-full pl-11 pr-11 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </motion.div>

                                <motion.div variants={itemVariants} className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-300 group-focus-within:text-red-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm"
                                        className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
                                        required
                                    />
                                </motion.div>
                            </div>
                        </div>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-4 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-red-100 hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:shadow-none"
                        >
                            {isLoading ? "Creating Portal..." : (
                                <>
                                    Join Foodio <FaArrowRight className="text-xs" />
                                </>
                            )}
                        </motion.button>

                    </form>

                    <div className="mt-8 text-center space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-3 text-gray-400 font-bold tracking-tighter">Or continue with</span>
                            </div>
                        </div>

                        <motion.a
                            variants={itemVariants}
                            href={`${import.meta.env.VITE_URL}/auth/googleoauth2`}
                            className="w-full inline-flex items-center justify-center gap-3 py-3 border-2 border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors text-sm font-bold text-gray-600"
                        >
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                                className="w-5 h-5"
                            />
                            Google Account
                        </motion.a>

                        <p className="text-sm font-semibold text-gray-500">
                            Already part of FOODIO?{" "}
                            <Link to="/login" className="text-red-600 hover:text-red-700 font-black">LOGIN</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;


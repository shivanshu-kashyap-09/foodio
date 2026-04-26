import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    FaBox,
    FaCheckCircle,
    FaTruck,
    FaUtensils,
    FaStore,
    FaHome,
    FaArrowLeft,
    FaClock,
    FaMapMarkerAlt
} from 'react-icons/fa';

const OrderTracking = () => {
    const { orderId } = useParams();
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const statuses = [
        { key: 'pending', label: 'Order Placed', icon: <FaBox />, color: 'bg-blue-500' },
        { key: 'confirmed', label: 'Confirmed', icon: <FaCheckCircle />, color: 'bg-purple-500' },
        { key: 'preparing', label: 'Kitchen Preparing', icon: <FaUtensils />, color: 'bg-orange-500' },
        { key: 'picked', label: 'Picked Up', icon: <FaStore />, color: 'bg-amber-500' },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: <FaTruck />, color: 'bg-yellow-500' },
        { key: 'delivered', label: 'Delivered', icon: <FaHome />, color: 'bg-green-500' }
    ];

    const currentStatusIdx = tracking?.order ? statuses.findIndex(s => s.key === tracking.order.status?.toLowerCase()) : 0;

    const fetchTracking = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_URL}/orders/${orderId}/tracking`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data.success) {
                setTracking(res.data.data);
            }
        } catch (err) {
            console.error('Tracking error:', err);
            setError('Could not fetch tracking details. Please ensure your order ID is correct.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTracking();
        const interval = setInterval(fetchTracking, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, [orderId]);

    if (loading && !tracking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50/20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-6 text-center max-w-2xl mx-auto">
                <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-red-100">
                    <FaBox className="text-6xl text-red-100 mx-auto mb-6" />
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Tracking Not Available</h2>
                    <p className="text-gray-500 mb-8">{error}</p>
                    <Link to="/cart" className="bg-red-600 text-white px-10 py-4 rounded-3xl font-bold hover:bg-red-700 transition-all">
                        Check My Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-gradient-to-br from-red-50/50 to-pink-50/50">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] shadow-xl p-8 mb-8 border border-red-50 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-12 bg-red-600/5 rounded-full -mr-12 -mt-12" />
                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center text-red-600 font-bold mb-6 hover:translate-x-1 transition-transform">
                            <FaArrowLeft className="mr-2" /> Back to Home
                        </Link>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Order #FD-{orderId}</h1>
                                <div className="flex items-center gap-4 text-gray-500 font-medium">
                                    <span className="flex items-center gap-2"><FaClock className="text-red-400" /> Est. Arrival: 25-30 mins</span>
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                            <div className="bg-green-50 text-green-700 px-6 py-3 rounded-2xl font-bold border border-green-100 animate-pulse">
                                Currently {statuses[currentStatusIdx]?.label || 'Moving'}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Progress Stepper */}
                <div className="bg-white rounded-[2.5rem] shadow-xl p-8 sm:p-12 mb-8 border border-red-50">
                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-8 left-0 right-0 h-1 bg-gray-100 hidden md:block">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentStatusIdx / (statuses.length - 1)) * 100}%` }}
                                className="h-full bg-red-600"
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </div>

                        <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-4">
                            {statuses.map((s, idx) => {
                                const isCompleted = idx <= currentStatusIdx;
                                const isCurrent = idx === currentStatusIdx;
                                return (
                                    <div key={s.key} className="flex flex-row md:flex-col items-center gap-6 md:gap-4">
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                scale: isCurrent ? 1.2 : 1,
                                                backgroundColor: isCompleted ? 'rgb(220 38 38)' : 'rgb(243 244 246)'
                                            }}
                                            className={`w-16 h-16 rounded-2.5xl flex items-center justify-center text-2xl ${isCompleted ? 'text-white shadow-xl shadow-red-200' : 'text-gray-400'}`}
                                        >
                                            {isCompleted ? <FaCheckCircle className="text-xl" /> : s.icon}
                                        </motion.div>
                                        <div className="text-left md:text-center">
                                            <p className={`font-black text-sm uppercase tracking-widest ${isCompleted ? 'text-red-600' : 'text-gray-400'}`}>
                                                {s.label}
                                            </p>
                                            {isCurrent && (
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-[10px] text-gray-400 font-bold mt-1"
                                                >
                                                    Current Step
                                                </motion.p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Tracking Details & Map Placeholder */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        {/* Delivery Partner */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-red-50"
                        >
                            <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                                <span className="bg-red-100 p-2 rounded-xl"><FaTruck className="text-red-600" /></span>
                                Delivery Info
                            </h3>
                            <div className="flex items-center gap-6">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                    alt="Rider"
                                    className="w-16 h-16 rounded-2xl bg-red-50"
                                />
                                <div>
                                    <p className="font-bold text-gray-900 text-lg">{tracking?.delivery?.partnerName || 'Assigning Partner...'}</p>
                                    <p className="text-gray-500 font-medium text-sm">
                                        {tracking?.delivery?.partnerName ? 'Your reliable delivery partner' : 'Searching for nearby partners...'}
                                    </p>
                                    {tracking?.delivery?.partnerPhone && (
                                        <div className="flex items-center gap-4 mt-2">
                                            <a href={`tel:${tracking.delivery.partnerPhone}`} className="text-red-600 font-bold text-xs underline underline-offset-4">Call Rider</a>
                                            <button className="text-red-600 font-bold text-xs underline underline-offset-4">Message</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Delivery Address */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-red-50"
                        >
                            <h3 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                                <span className="bg-red-100 p-2 rounded-xl"><FaMapMarkerAlt className="text-red-600" /></span>
                                Drop-off Location
                            </h3>
                            <p className="font-bold text-gray-800 leading-relaxed">
                                {tracking?.order?.deliveryAddress || "123, Foodie Heights, Cyber City, Gurgaon, Haryana - 122001"}
                            </p>
                        </motion.div>
                    </div>

                    {/* Map Simulation */}
                    <div className="bg-gray-900 h-full min-h-[400px] rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        <img
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000"
                            alt="Map Placeholder"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-10000 linear"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/40 to-transparent" />

                        {/* Simulated Rider Marker */}
                        <motion.div
                            animate={{
                                x: [0, 40, -20, 10, 0],
                                y: [0, -30, 20, -10, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-40" />
                                <div className="bg-red-600 p-4 rounded-full shadow-2xl text-white relative border-4 border-white">
                                    <FaTruck className="text-xl" />
                                </div>
                            </div>
                        </motion.div>

                        <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-white">
                            <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Status</p>
                            <p className="font-bold text-lg">
                                {tracking?.order?.status === 'out_for_delivery' 
                                    ? `Rider is ${tracking?.delivery?.distance || '1.2'}km away from your location`
                                    : tracking?.order?.status === 'delivered'
                                    ? 'Order has been delivered! Enjoy your meal 🍕'
                                    : 'Preparing your order at the restaurant...'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;

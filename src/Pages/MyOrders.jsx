import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBox, FaClock, FaCalendarAlt, FaChevronRight, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const USER_ID = localStorage.getItem('user_id');
    const API = import.meta.env.VITE_URL;

    const handleCancelOrder = async (orderId) => {
        try {
            const res = await axios.put(
                `${API}/user/orders/${USER_ID}/orders/${orderId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            if (res.status === 200 && res.data.success) {
                setOrders(prev => prev.filter(order => (order.order_id || order.id) !== orderId));
            } else {
                console.error('Cancel response error', res.data);
            }
        } catch (err) {
            console.error('Failed to cancel order', err);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${API}/user/orders/${USER_ID}/orders`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                // Note: res.data might be paginated based on my earlier check of orderRoute.js
                const ordersData = res.data.data?.items || res.data.data || [];
                setOrders(ordersData);
            } catch (err) {
                console.error("Orders fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [USER_ID, API]);

    const getStatusColor = (status) => {
        switch(status.toLowerCase()) {
            case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
            case 'delivered': return 'text-green-600 bg-green-50 border-green-100';
            case 'cancelled': return 'text-red-600 bg-red-50 border-red-100';
            default: return 'text-blue-600 bg-blue-50 border-blue-100';
        }
    };

    if (loading) {
        return (
            <div className="mt-20 p-6 space-y-4 max-w-4xl mx-auto pt-32">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-4 items-center bg-white p-6 rounded-[2.5rem] border border-gray-100">
                        <div className="w-16 h-16 bg-gray-300 rounded"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-gray-50/50">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-10"
                >
                    <h1 className="text-4xl font-black text-gray-900">Your Orders</h1>
                    <div className="bg-red-100 text-red-600 px-4 py-2 rounded-2xl font-bold text-sm">
                        {orders.length} Total
                    </div>
                </motion.div>

                {orders.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white p-16 rounded-[2.5rem] shadow-xl text-center border border-gray-100"
                    >
                        <FaBox className="text-6xl text-gray-200 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">Looks like you haven't ordered anything yet. Time to change that!</p>
                        <Link to="/" className="bg-red-600 text-white px-8 py-4 rounded-3xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200">
                            Explore Restaurants
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence>
                            {orders.map((order, idx) => (
                                <motion.div
                                    key={order.order_id || order.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-[2.5rem] shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    <div className="p-8">
                                        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 text-2xl">
                                                    <FaBox />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Order #FD-{order.order_id || order.id}</p>
                                                    <h3 className="text-xl font-black text-gray-900">Order from Restaurant</h3>
                                                </div>
                                            </div>
                                            <span className={`px-4 py-2 rounded-xl text-sm font-bold border ${getStatusColor(order.delivery_status || order.status || 'Pending')}`}>
                                                {(order.delivery_status || order.status || 'Pending').toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pt-6 border-t border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <FaCalendarAlt className="text-gray-300" />
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Date</p>
                                                    <p className="font-bold text-gray-700 text-sm">
                                                        {new Date(order.created_at || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <FaClock className="text-gray-300" />
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Time</p>
                                                    <p className="font-bold text-gray-700 text-sm">
                                                        {new Date(order.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <FaBox className="text-gray-300" />
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Items</p>
                                                    <p className="font-bold text-gray-700 text-sm">₹{order.total || order.totalAmount || order.total_amount}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <FaMapMarkerAlt className="text-gray-300" />
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Area</p>
                                                    <p className="font-bold text-gray-700 text-sm truncate max-w-[100px]">{order.city || "Gurgaon"}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 sm:flex-row">
                                            <Link 
                                                to={`/order/tracking/${order.order_id || order.id}`}
                                                className="flex-1 bg-gray-900 text-white text-center py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg"
                                            >
                                                Track Now <FaChevronRight className="text-xs" />
                                            </Link>
                                            <div className="flex flex-1 gap-3">
                                                {!['delivered', 'cancelled'].includes(((order.delivery_status || order.status) || '').toLowerCase()) && (
                                                    <button
                                                        onClick={() => handleCancelOrder(order.order_id || order.id)}
                                                        className="flex-1 bg-red-600 text-white text-center py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                <button className="flex-1 bg-red-500 text-white text-center py-4 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100">
                                                    Reorder
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;

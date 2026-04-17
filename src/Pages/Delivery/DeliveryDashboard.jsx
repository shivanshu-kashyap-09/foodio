import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';

const DeliveryDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [otpRequests, setOtpRequests] = useState({});
    const [socket, setSocket] = useState(null);
    
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_URL || 'http://localhost:5000';

    const formatCurrency = (value) => {
        const amount = Number(value);
        return Number.isFinite(amount) ? amount.toFixed(2) : '0.00';
    };

    useEffect(() => {
        const fetchDeliveryData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const [pendingRes, assignedRes, statsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_URL}/delivery/pending-orders`, config),
                    axios.get(`${import.meta.env.VITE_URL}/delivery/assigned-orders`, config),
                    axios.get(`${import.meta.env.VITE_URL}/delivery/stats`, config)
                ]);

                if (pendingRes.data.success) setOrders(pendingRes.data.data);
                if (assignedRes.data.success) setAssignedOrders(assignedRes.data.data);
                if (statsRes.data.success && statsRes.data.data) {
                    setStats(statsRes.data.data);
                    setIsOnline(statsRes.data.data.status === 'available');
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch delivery data:', error);
                setLoading(false);
            }
        };

        fetchDeliveryData();

        // Socket integration
        const newSocket = io(socketUrl, {
            auth: { token, userId: user?.user_id }
        });

        newSocket.on('notification:new', (notification) => {
            if (notification.type === 'order.new_available') {
                setNotifications(prev => [notification, ...prev]);
                // Automatically add to pool if not already there
                setOrders(prev => {
                    if (prev.find(o => o.order_id === notification.orderId)) return prev;
                    return [
                        { 
                            order_id: notification.orderId, 
                            total_amount: notification.total, 
                            delivery_charges: notification.charges,
                            city: notification.city
                        }, 
                        ...prev
                    ];
                });
            }
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, [token, user?.user_id]);

    const handleToggleStatus = async () => {
        try {
            const nextStatus = isOnline ? 'offline' : 'available';
            const res = await axios.put(`${import.meta.env.VITE_URL}/delivery/toggle-status`, { status: nextStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setIsOnline(!isOnline);
            }
        } catch (error) {
            console.error('Failed to toggle status:', error);
        }
    };

    const handleAccept = async (orderId) => {
        if (!isOnline) {
            alert("Go online first to accept orders!");
            return;
        }
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/delivery/accept-order`, { orderId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setOrders(prev => prev.filter(o => o.order_id !== orderId));
                // Refetch assigned orders
                const assignedRes = await axios.get(`${import.meta.env.VITE_URL}/delivery/assigned-orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (assignedRes.data.success) setAssignedOrders(assignedRes.data.data);
                
                // Clear notification
                setNotifications(prev => prev.filter(n => n.orderId !== orderId));
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to accept order");
        }
    };

    const handleOtpChange = (orderId, value) => {
        setOtpRequests(prev => ({ ...prev, [orderId]: value }));
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            const payload = { orderId, status };
            if (['picked', 'delivered'].includes(status)) {
                const otp = otpRequests[orderId]?.trim();
                if (!otp) {
                    alert(`Please enter the OTP to ${status === 'picked' ? 'pick up' : 'complete'} the order.`);
                    return;
                }
                payload.otp = otp;
            }
            const res = await axios.put(`${import.meta.env.VITE_URL}/delivery/order-status`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setAssignedOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status } : o));
                setOtpRequests(prev => ({ ...prev, [orderId]: '' }));
                
                // If delivered, refresh stats & assigned orders
                if (status === 'delivered') {
                    const [statsRes, assignedRes] = await Promise.all([
                        axios.get(`${import.meta.env.VITE_URL}/delivery/stats`, {
                            headers: { Authorization: `Bearer ${token}` }
                        }),
                        axios.get(`${import.meta.env.VITE_URL}/delivery/assigned-orders`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    ]);
                    if (statsRes.data.success) setStats(statsRes.data.data);
                    if (assignedRes.data.success) setAssignedOrders(assignedRes.data.data);
                }
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            alert(error.response?.data?.message || 'Failed to update order status');
        }
    };

    if (loading) {
        return (
            <div className="mt-20 p-6 space-y-4 max-w-6xl mx-auto min-h-screen bg-gray-100 pt-10">
                {[1, 2, 3, 4].map((_, i) => (
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
        <div className="min-h-screen bg-gray-100 p-6 md:p-10 font-sans mt-20">
            <div className="max-w-6xl mx-auto">
                <AnimatePresence>
                    {notifications.length > 0 && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mb-6 overflow-hidden"
                        >
                            {notifications.map(n => (
                                <div key={n.orderId} className="bg-blue-600 text-white p-4 rounded-2xl flex justify-between items-center shadow-lg mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">🆕</span>
                                        <div>
                                            <p className="font-bold">New Order Available!</p>
                                            <p className="text-xs opacity-90">Order #ORD-{n.orderId} • Potential Earning: ₹{n.charges}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleAccept(n.orderId)}
                                        className="bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
                                    >Grab Now</button>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-6">
                        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
                            Delivery <span className="text-blue-500 underline decoration-blue-200 underline-offset-8">Partner</span>
                        </h1>
                        <button 
                            onClick={handleToggleStatus}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${isOnline ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}
                        >
                            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                            {isOnline ? 'ONLINE' : 'OFFLINE'}
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="block text-sm font-semibold text-gray-800">{user?.user_name || "Delivery Partner"}</span>
                            <span className="block text-xs text-blue-500 font-bold uppercase tracking-widest">{stats?.vehicle_type || "Partner"} | Total: ₹{formatCurrency(stats?.totalEarnings)}</span>
                        </div>
                        <img src={user?.user_image || "https://api.dicebear.com/7.x/avataaars/svg?seed=delivery"} alt="" className="w-12 h-12 rounded-full border-2 border-blue-100 shadow-inner bg-gray-50 p-1" />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <section className="lg:col-span-8 flex flex-col gap-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                            🚀 Your Active Runs
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-bold">{assignedOrders.length}</span>
                        </h3>
                        {assignedOrders.length === 0 ? (
                            <div className="p-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center text-gray-400 font-medium tracking-tight">
                                {isOnline ? "Waiting for new orders... Stay tuned!" : "Go online to start receiving orders."}
                            </div>
                        ) : (
                            assignedOrders.map(o => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={o.order_id} 
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6"
                                >
                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-lg font-bold text-gray-800">Order #ORD-{o.order_id}</h4>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide
                                                ${o.status === 'confirmed' ? 'bg-amber-100 text-amber-600' : 
                                                  o.status === 'picked' ? 'bg-purple-100 text-purple-600' :
                                                  o.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                                {o.status === 'confirmed' ? 'Accepted' : o.status === 'picked' ? 'Picked Up' : o.status === 'out_for_delivery' ? 'Out for Delivery' : o.status === 'delivered' ? 'Delivered' : o.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-500">
                                            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100"><span className="block text-[10px] text-gray-400 font-bold uppercase">Order Total</span> ₹{o.total_amount}</div>
                                            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100"><span className="block text-[10px] text-gray-400 font-bold uppercase">Earnings</span> ₹{o.delivery_charges}</div>
                                        </div>
                                        <div className="mt-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-600">
                                            <p className="text-gray-400 font-bold uppercase text-[9px] mb-1">Deliver To</p>
                                            <p className="font-medium">{o.delivery_address}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 w-full md:w-48">
                                        {o.status === 'confirmed' && (
                                            <>
                                                <input
                                                    type="text"
                                                    value={otpRequests[o.order_id] || ''}
                                                    onChange={(e) => handleOtpChange(o.order_id, e.target.value)}
                                                    placeholder="Enter handover OTP"
                                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-700 focus:ring-2 focus:ring-amber-200 outline-none"
                                                />
                                                <button 
                                                    className="w-full py-4 bg-amber-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-amber-100 transition-transform active:scale-95"
                                                    onClick={() => handleUpdateStatus(o.order_id, 'picked')}
                                                >Verify Pickup</button>
                                            </>
                                        )}
                                        {o.status === 'picked' && (
                                            <button 
                                                className="w-full py-4 bg-blue-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-100 transition-transform active:scale-95"
                                                onClick={() => handleUpdateStatus(o.order_id, 'out_for_delivery')}
                                            >Start Delivery</button>
                                        )}
                                        {o.status === 'out_for_delivery' && (
                                            <>
                                                <input
                                                    type="text"
                                                    value={otpRequests[o.order_id] || ''}
                                                    onChange={(e) => handleOtpChange(o.order_id, e.target.value)}
                                                    placeholder="Enter delivery OTP"
                                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-700 focus:ring-2 focus:ring-green-200 outline-none"
                                                />
                                                <button 
                                                    className="w-full py-4 bg-green-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-green-100 transition-transform active:scale-95 animate-pulse"
                                                    onClick={() => handleUpdateStatus(o.order_id, 'delivered')}
                                                >Complete Delivery</button>
                                            </>
                                        )}
                                        {o.status === 'delivered' && (
                                            <div className="w-full py-4 bg-green-50 text-green-600 rounded-2xl text-sm font-bold text-center border border-green-200">
                                                ✅ Completed • Earned ₹{o.delivery_charges || 50}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </section>

                    <aside className="lg:col-span-4 flex flex-col gap-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                            🛍️ Available Pool
                            <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-xs font-bold">{orders.length}</span>
                        </h3>
                        <div className="flex flex-col gap-4">
                            {orders.length === 0 ? (
                                <p className="text-xs text-gray-400 font-medium italic text-center p-10 bg-white rounded-3xl border border-gray-100">No tasks in your zone right now.</p>
                            ) : (
                                orders.map(o => (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={o.order_id} 
                                        className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:border-blue-300 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-gray-800">#{o.order_id}</h4>
                                            <span className="text-green-600 font-bold">Earn ₹{o.delivery_charges || 50}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                            <span className="flex items-center gap-1">📍 {o.city || "Nearby"}</span>
                                        </div>
                                        <button 
                                            className={`w-full py-3 rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 ${isOnline ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                            onClick={() => handleAccept(o.order_id)}
                                            disabled={!isOnline}
                                        >Grab Task</button>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;

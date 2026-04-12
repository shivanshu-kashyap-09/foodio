import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const DeliveryDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [assignedOrders, setAssignedOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchDeliveryData = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                };
                const [pendingRes, assignedRes, statsRes] = await Promise.all([
                    axios.get('/api/delivery/pending-orders', config),
                    axios.get('/api/delivery/assigned-orders', config),
                    axios.get('/api/delivery/stats', config)
                ]);

                if (pendingRes.data.success) setOrders(pendingRes.data.data);
                if (assignedRes.data.success) setAssignedOrders(assignedRes.data.data);
                if (statsRes.data.success) setStats(statsRes.data.data);
                
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch delivery data:', error);
                setLoading(false);
            }
        };

        fetchDeliveryData();
    }, []);

    const handleAccept = async (orderId) => {
        try {
            const res = await axios.post('/api/delivery/accept-order', { orderId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.data.success) {
                setOrders(prev => prev.filter(o => o.order_id !== orderId));
                setAssignedOrders(prev => [...prev, { order_id: orderId, delivery_status: 'Accepted' }]);
            }
        } catch (error) {
            console.error('Failed to accept order:', error);
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            const res = await axios.put('/api/delivery/order-status', { orderId, status }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.data.success) {
                setAssignedOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, delivery_status: status } : o));
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    if (loading) {
        return (
            <div className="mt-20 p-6 space-y-4 max-w-6xl mx-auto min-h-screen bg-gray-100 pt-10">
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
        <div className="min-h-screen bg-gray-100 p-6 md:p-10 font-sans mt-20">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
                        Delivery <span className="text-blue-500 underline decoration-blue-200 underline-offset-8">Partner</span>
                        <div className="px-3 py-1 bg-blue-100 text-blue-500 rounded-full text-xs font-bold animate-pulse">ONLINE</div>
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="block text-sm font-semibold text-gray-800">{user?.user_name || "Delivery Partner"}</span>
                            <span className="block text-xs text-green-500 font-bold uppercase tracking-widest">{stats?.vehicle_type || "Partner"} | ₹{stats?.totalEarnings?.toFixed(2) || "0.00"}</span>
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
                            <div className="p-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center text-gray-400 font-medium">Ready for your shift? Pick a task from the right!</div>
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
                                                ${o.delivery_status === 'Accepted' ? 'bg-amber-100 text-amber-600' : 
                                                  o.delivery_status === 'Picked' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                                {o.delivery_status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-500">
                                            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100"><span className="block text-[10px] text-gray-400">TOTAL</span> ₹{o.total}</div>
                                            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100"><span className="block text-[10px] text-gray-400">PAYMENT</span> {o.payment}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3 w-full md:w-48">
                                        {o.delivery_status === 'Accepted' && (
                                            <button 
                                                className="w-full py-4 bg-amber-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-amber-100 transition-transform active:scale-95"
                                                onClick={() => handleUpdateStatus(o.order_id, 'Picked')}
                                            >Pick Up Order</button>
                                        )}
                                        {o.delivery_status === 'Picked' && (
                                            <button 
                                                className="w-full py-4 bg-blue-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-100 transition-transform active:scale-95"
                                                onClick={() => handleUpdateStatus(o.order_id, 'Out for delivery')}
                                            >Start Delivery</button>
                                        )}
                                        {o.delivery_status === 'Out for delivery' && (
                                            <button 
                                                className="w-full py-4 bg-green-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-green-100 transition-transform active:scale-95 animate-bounce"
                                                onClick={() => handleUpdateStatus(o.order_id, 'Delivered')}
                                            >Complete Run</button>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </section>

                    <aside className="lg:col-span-4 flex flex-col gap-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                            🛍️ Global Pool
                            <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-xs font-bold">{orders.length}</span>
                        </h3>
                        <div className="flex flex-col gap-4">
                            {orders.length === 0 ? (
                                <p className="text-xs text-gray-400 font-medium italic text-center p-10">No tasks in your zone, please refresh.</p>
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
                                            <span className="text-blue-500 font-bold">₹{o.total}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                            <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-blue-400"></div> 3.4 KM</span>
                                            <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-green-400"></div> 12 MIN</span>
                                        </div>
                                        <button 
                                            className="w-full py-3 bg-gray-50 text-gray-800 group-hover:bg-blue-600 group-hover:text-white rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95"
                                            onClick={() => handleAccept(o.order_id)}
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

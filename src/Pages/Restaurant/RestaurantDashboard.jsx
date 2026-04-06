import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaUtensils, FaChartLine, FaShoppingBag, FaUsers, 
    FaStar, FaPlus, FaSearch, FaEllipsisV, 
    FaRobot, FaMagic, FaArrowUp, FaBell,
    FaBox, FaCheese, FaPizzaSlice, FaHamburger
} from 'react-icons/fa';
import { 
    Chart as ChartJS, CategoryScale, LinearScale, 
    PointElement, LineElement, BarElement, 
    Title, Tooltip, Legend, Filler 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { toast } from 'react-toastify';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, 
    LineElement, BarElement, Title, Tooltip, Legend, Filler
);

const RestaurantDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [summary, setSummary] = useState({ earnings: 0, orders: 0, customers: 0, avg_rating: '0.0' });
    const [orders, setOrders] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [dishType, setDishType] = useState('veg');
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newDish, setNewDish] = useState({
        dish_name: '',
        dish_price: '',
        dish_description: '',
        dish_image: '',
        dish_rating: 4.5
    });

    const user = JSON.parse(localStorage.getItem('user'));

    const [analytics, setAnalytics] = useState([]);

    useEffect(() => {
        fetchAllData();
    }, [dishType]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [summaryRes, ordersRes, dishesRes, analyticsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_URL}/restaurant/dashboard/summary`),
                axios.get(`${import.meta.env.VITE_URL}/restaurant/dashboard/orders`),
                axios.get(`${import.meta.env.VITE_URL}/restaurant/dashboard/dishes/${dishType}`),
                axios.get(`${import.meta.env.VITE_URL}/restaurant/dashboard/analytics`)
            ]);

            if (summaryRes.data.success) setSummary(summaryRes.data.data);
            if (ordersRes.data.success) setOrders(ordersRes.data.data);
            if (dishesRes.data.success) setDishes(dishesRes.data.data);
            if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
        } catch (error) {
            console.error('Dashboard Error:', error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const res = await axios.put(`${import.meta.env.VITE_URL}/restaurant/dashboard/order-status`, {
                orderId,
                status: newStatus
            });
            if (res.data.success) {
                toast.success(`Order marked as ${newStatus}`);
                setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, delivery_status: newStatus } : o));
            }
        } catch (err) {
            toast.error("Status update failed");
        }
    };

    const handleAddDish = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/restaurant/dashboard/add-dish`, {
                ...newDish,
                type: dishType
            });
            if (res.data.success) {
                toast.success("Dish added to menu!");
                setIsAddModalOpen(false);
                setNewDish({ dish_name: '', dish_price: '', dish_description: '', dish_image: '', dish_rating: 4.5 });
                fetchAllData();
            }
        } catch (err) {
            toast.error("Failed to add dish");
        }
    };

    // Chart Data
    const revenueData = {
        labels: analytics.length > 0 
           ? analytics.map(a => new Date(a.date).toLocaleDateString('en-US', { weekday: 'short' })) 
           : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            fill: true,
            label: 'Daily Earnings (₹)',
            data: analytics.length > 0 
               ? analytics.map(a => a.earnings) 
               : [4500, 5200, 4800, 7000, 8500, 12000, 15000],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
        }]
    };

    const ordersTrendData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Orders Count',
            data: [20, 25, 22, 35, 45, 60, 75],
            backgroundColor: '#3b82f6',
            borderRadius: 10,
        }]
    };

    if (loading && activeTab === 'overview') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-black animate-pulse uppercase tracking-widest text-sm text-center">
                        Initializing Restaurant <br /> SaaS Dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] mt-16 lg:mt-20 px-4 sm:px-6 lg:px-8 pb-12 font-sans">
            <div className="max-w-7xl mx-auto py-6">
                
                {/* Dashboard Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-[2rem] shadow-xl shadow-red-50/50 border border-red-50">
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 tracking-tight">
                            Restaurant <span className="text-red-600">Dashboard</span>
                        </h1>
                        <p className="text-gray-400 text-sm font-semibold">Welcome back, {user?.user_name} 👋</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="bg-gray-50 p-3 rounded-full text-gray-400 hover:text-red-500 transition-colors relative">
                            <FaBell />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                        >
                            <FaPlus /> Add Dish
                        </button>
                    </div>
                </header>

                {/* Main Navigation */}
                <nav className="flex gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
                    {['overview', 'orders', 'menu', 'ai-insights'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                activeTab === tab 
                                ? 'bg-red-600 text-white shadow-lg shadow-red-100' 
                                : 'text-gray-400 hover:bg-gray-50'
                            }`}
                        >
                            {tab.replace('-', ' ')}
                        </button>
                    ))}
                </nav>

                <AnimatePresence mode="wait">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* Summary Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Earnings', value: `₹${summary?.earnings || 0}`, icon: <FaChartLine />, color: 'bg-green-50 text-green-600', trend: '+15%' },
                                    { label: 'Total Orders', value: summary?.orders || 0, icon: <FaShoppingBag />, color: 'bg-blue-50 text-blue-600', trend: '+8%' },
                                    { label: 'Total Customers', value: summary?.customers || 0, icon: <FaUsers />, color: 'bg-orange-50 text-orange-600', trend: 'Healthy' },
                                    { label: 'Avg Rating', value: summary?.avg_rating || '0.0', icon: <FaStar />, color: 'bg-yellow-50 text-yellow-600', trend: 'Global' }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:border-red-200 transition-all">
                                        <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>
                                            {stat.icon}
                                        </div>
                                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                        <div className="flex items-end gap-2">
                                            <h3 className="text-2xl font-black text-gray-800">{stat.value}</h3>
                                            <span className="text-[10px] font-bold text-green-500 mb-1 flex items-center italic">
                                                <FaArrowUp className="text-[8px] mr-1" /> {stat.trend}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Charts Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-xl font-black text-gray-800 tracking-tight uppercase">Revenue Analytics</h3>
                                        <select className="bg-gray-50 border-none text-xs font-bold rounded-lg px-3 py-1 outline-none text-gray-500">
                                            <option>Last 7 Days</option>
                                            <option>Last 30 Days</option>
                                        </select>
                                    </div>
                                    <div className="h-64">
                                        <Line data={revenueData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
                                    </div>
                                </section>

                                <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-black text-gray-800 tracking-tight mb-8 uppercase text-center md:text-left">Order Trends</h3>
                                    <div className="h-64">
                                        <Bar data={ordersTrendData} options={{ maintainAspectRatio: false }} />
                                    </div>
                                </section>
                            </div>

                            {/* Top Selling Dishes - Mock AI Insight */}
                            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                                <h3 className="text-xl font-black text-gray-800 tracking-tight mb-6 uppercase">Trending This Week</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { name: 'Paneer Masala', orders: 124, growth: '+24%', img: 'https://b.zmtcdn.com/data/dish_photos/511/87823f990adaba9876778643806a1511.jpg' },
                                        { name: 'Classic Burger', orders: 98, growth: '+12%', img: 'https://b.zmtcdn.com/data/dish_photos/e07/d0e57e93b137e0984920409051052e07.jpg' },
                                        { name: 'Masala Dosa', orders: 86, growth: '+5%', img: 'https://b.zmtcdn.com/data/dish_photos/0c5/6af9c22ac7b40de19dda8995b96680c5.jpg' }
                                    ].map((dish, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-3xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-red-100">
                                            <img src={dish.img} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="" />
                                            <div>
                                                <h4 className="font-black text-gray-800 uppercase text-xs">{dish.name}</h4>
                                                <p className="text-[10px] font-bold text-gray-400">{dish.orders} Orders</p>
                                                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{dish.growth} Growth</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                    <h3 className="text-xl font-black text-gray-800 tracking-tight uppercase">Incoming Orders</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Updates</span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-widest text-left">
                                            <tr>
                                                <th className="px-6 py-4">Order ID</th>
                                                <th className="px-6 py-4">Customer</th>
                                                <th className="px-6 py-4">Total</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {orders.map((order) => (
                                                <tr key={order.order_id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-4 font-black text-gray-800 text-xs">#FD-{order.order_id}</td>
                                                    <td className="px-6 py-4 text-xs font-bold text-gray-600 underline">User ID: {order.user_id}</td>
                                                    <td className="px-6 py-4 font-black text-red-600 text-xs">₹{order.total}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                            order.delivery_status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                                                            order.delivery_status === 'Confirmed' ? 'bg-blue-100 text-blue-600' :
                                                            'bg-green-100 text-green-600'
                                                        }`}>
                                                            {order.delivery_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center gap-2">
                                                            {order.delivery_status === 'Pending' && (
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(order.order_id, 'Confirmed')}
                                                                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-blue-700 shadow-md shadow-blue-100 transition-all"
                                                                >Confirm</button>
                                                            )}
                                                            {order.delivery_status === 'Confirmed' && (
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(order.order_id, 'Preparing')}
                                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-red-700 shadow-md shadow-red-100 transition-all"
                                                                >Preparing</button>
                                                            )}
                                                            {order.delivery_status === 'Preparing' && (
                                                                <button 
                                                                    onClick={() => handleUpdateStatus(order.order_id, 'Out for Delivery')}
                                                                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-[10px] font-black uppercase hover:bg-yellow-600 shadow-md shadow-yellow-100 transition-all"
                                                                >Finish</button>
                                                            )}
                                                            <button className="p-2 text-gray-300 hover:text-gray-500"><FaEllipsisV /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {orders.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-bold italic uppercase tracking-widest text-xs">No active orders right now</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Menu Tab */}
                    {activeTab === 'menu' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex gap-2 bg-gray-50 p-1 rounded-2xl">
                                    {['veg', 'nonveg', 'southindian'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setDishType(type)}
                                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                dishType === type ? 'bg-white text-red-600 shadow-md' : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                    <input 
                                        type="text" 
                                        placeholder="Search menu..." 
                                        className="pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-xs font-bold w-64 focus:ring-2 focus:ring-red-100 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {dishes.map((dish) => (
                                    <motion.div 
                                        layout
                                        key={dish.dish_id}
                                        className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-red-50/50 hover:border-red-100 transition-all group"
                                    >
                                        <div className="relative h-48">
                                            <img src={dish.dish_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-red-600 shadow-sm flex items-center gap-1">
                                                <FaStar className="text-yellow-400" /> {dish.dish_rating}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-black text-gray-800 uppercase text-sm tracking-tight">{dish.dish_name}</h4>
                                                <span className="font-black text-red-600 text-lg">₹{dish.dish_price}</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold mb-6 line-clamp-2 leading-relaxed">{dish.dish_description}</p>
                                            <div className="flex gap-2">
                                                <button className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Edit Dish</button>
                                                <button className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all"><FaEllipsisV className="text-[10px]" /></button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* AI Insights & Recommendation Module */}
                    {activeTab === 'ai-insights' && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        >
                            {/* AI Recommendation Panel */}
                            <section className="lg:col-span-2 space-y-8">
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-10">
                                        <FaRobot className="text-[10rem] text-white" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-red-500 rounded-2xl flex items-center justify-center text-white text-xl">
                                                <FaMagic />
                                            </div>
                                            <h3 className="text-white font-black uppercase tracking-widest text-lg">AI Sales Optimizer</h3>
                                        </div>
                                        <h2 className="text-3xl text-white font-black mb-10 leading-snug">
                                            Your revenue could grow by <span className="text-red-500 underline underline-offset-8">23%</span> next month.
                                        </h2>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {[
                                                { title: 'Dynamic Pricing', text: 'Reduce "Classic Burger" price by ₹20 during 4-6 PM to boost sales by 45%.', action: 'Apply Now' },
                                                { title: 'Inventory Alert', text: 'Tomato stock running low. Market price up 15% tomorrow. Order today.', action: 'Order Stock' },
                                                { title: 'Combo Strategy', text: 'Customers who buy "Masala Dosa" also like "Filter Coffee". Create a combo.', action: 'Create Combo' },
                                                { title: 'Campaign Alert', text: 'Toursim peak this Sat-Sun. Run a "Weekend Feast" 10% off promotion.', action: 'Run Promo' }
                                            ].map((insight, idx) => (
                                                <div key={idx} className="bg-white/5 backdrop-blur p-6 rounded-[2rem] border border-white/10 group hover:bg-white/10 transition-all">
                                                    <h4 className="text-red-500 text-xs font-black uppercase tracking-widest mb-3">{insight.title}</h4>
                                                    <p className="text-gray-400 text-xs font-bold leading-relaxed mb-6">{insight.text}</p>
                                                    <button className="w-full py-3 bg-white text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                                        {insight.action}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Sentiment Analysis */}
                                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-48 h-48 bg-gray-50 rounded-full border-[12px] border-green-500 flex items-center justify-center relative">
                                        <div className="text-center">
                                            <p className="text-3xl font-black text-gray-800 tracking-tighter leading-none">92%</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Positive</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-black text-gray-800 uppercase mb-4">Sentiment Analysis</h3>
                                        <p className="text-sm font-bold text-gray-500 leading-relaxed max-w-sm mb-6">
                                            Our AI scanned 1,200+ reviews. Customers love your <span className="text-red-500">spices</span> and <span className="text-red-500">packaging</span>. 
                                            Suggestion: Improve delivery speed for "South Indian" menu items.
                                        </p>
                                        <div className="flex gap-2 justify-center md:justify-start">
                                            {['Fresh', 'Fast', 'Hot', 'Tasty'].map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tighter">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Predictive Customer Base */}
                            <section className="space-y-8">
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-8">
                                        <FaUsers className="text-red-500 text-2xl" />
                                        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Customer Loyalty</h3>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'New Customers', current: 450, total: 600, color: 'bg-blue-500' },
                                            { label: 'Returning', current: 890, total: 1000, color: 'bg-green-500' },
                                            { label: 'Lost Customers', current: 30, total: 100, color: 'bg-red-500' }
                                        ].map((item, idx) => (
                                            <div key={idx}>
                                                <div className="flex justify-between items-center text-xs font-black uppercase tracking-tighter mb-2">
                                                    <span className="text-gray-500">{item.label}</span>
                                                    <span className="text-gray-800">{item.current}</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(item.current / item.total) * 100}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className={`h-full ${item.color}`}
                                                    ></motion.div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-8 text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                                        Predicted customer growth: <span className="text-green-500">+12%</span> by next week.
                                    </p>
                                </div>

                                {/* Marketing Tip */}
                                <div className="bg-red-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-red-100 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6">
                                        <FaRobot className="animate-bounce" />
                                    </div>
                                    <h4 className="text-lg font-black uppercase tracking-tighter mb-2">Smart Ad Tip</h4>
                                    <p className="text-sm text-red-100 font-medium leading-relaxed mb-6">
                                        Advertise your "Paneer Specials" on Instagram tonight. Our AI detected high search volume in your area.
                                    </p>
                                    <button className="px-8 py-3 bg-white text-red-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">Schedule Ad</button>
                                </div>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Add Dish Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden border border-gray-100"
                        >
                            <div className="bg-gradient-to-r from-red-600 to-red-500 p-10 text-white">
                                <h3 className="text-2xl font-black uppercase tracking-widest mb-2">Add New Dish</h3>
                                <p className="text-red-100 text-xs font-bold">Populate your {dishType} menu with something delicious.</p>
                            </div>
                            <form onSubmit={handleAddDish} className="p-10 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Dish Name</label>
                                        <input 
                                            required
                                            value={newDish.dish_name}
                                            onChange={(e) => setNewDish({...newDish, dish_name: e.target.value})}
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-red-100 transition-all outline-none"
                                            placeholder="e.g. Butter Paneer"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Price (₹)</label>
                                        <input 
                                            required
                                            type="number"
                                            value={newDish.dish_price}
                                            onChange={(e) => setNewDish({...newDish, dish_price: e.target.value})}
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-red-100 transition-all outline-none"
                                            placeholder="e.g. 299"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Description</label>
                                    <textarea 
                                        required
                                        rows="3"
                                        value={newDish.dish_description}
                                        onChange={(e) => setNewDish({...newDish, dish_description: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-red-100 transition-all outline-none resize-none"
                                        placeholder="Briefly describe the flavors..."
                                    ></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Image URL</label>
                                    <input 
                                        required
                                        value={newDish.dish_image}
                                        onChange={(e) => setNewDish({...newDish, dish_image: e.target.value})}
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-red-100 transition-all outline-none"
                                        placeholder="https://image-url.com/dish.jpg"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
                                    >Cancel</button>
                                    <button 
                                        type="submit"
                                        className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-100 hover:bg-red-700 transition-all"
                                    >Add to Menu</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RestaurantDashboard;

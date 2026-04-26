import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Title, Tooltip, Legend, Filler, ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUsers, FaArrowUp, FaArrowDown, FaChartLine, FaBox, FaMoneyBillWave,
    FaCog, FaSignOutAlt, FaBars, FaBell, FaSearch, FaCheckCircle,
    FaTimesCircle, FaTruck, FaMapMarkerAlt, FaDatabase, FaStore,
    FaShieldAlt, FaSpinner, FaTrash, FaPause, FaPlay
} from 'react-icons/fa';

import logo from '../../assets/logo.png';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const API_BASE = import.meta.env.VITE_URL || 'http://localhost:3000/api';

const SuperAdminDashboard = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [notification, setNotification] = useState(null);

    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalUsers: 0, activeDelivery: 0 });
    const [revenueData, setRevenueData] = useState({ labels: ['Jan','Feb','Mar','Apr','May','Jun'], data: [0,0,0,0,0,0] });
    const [pendingRestaurants, setPendingRestaurants] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [deliveryList, setDeliveryList] = useState([]);
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [ordersList, setOrdersList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Real-time System Logs
    const [realTimeLogs, setRealTimeLogs] = useState([]);
    const [logFilter, setLogFilter] = useState('ALL');
    const [autoScroll, setAutoScroll] = useState(true);
    const [logConnected, setLogConnected] = useState(false);
    const logsEndRef = useRef(null);
    const sseRef = useRef(null);

    // Get admin info from localStorage
    const adminUser = JSON.parse(localStorage.getItem('user') || '{"user_name":"Super Admin","user_gmail":"admin@foodio.com"}');
    const adminName = adminUser.user_name || 'Super Admin';
    const adminEmail = adminUser.user_gmail || 'admin@foodio.com';
    const adminAvatar = adminUser.user_img || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=dc2626&color=fff&size=200`;

    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3500);
    };

    const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

    const fetchAllData = async () => {
        try {
            const [resStats, resUsers, resDel, resRest, resRev, resAllRest, resAllOrders] = await Promise.all([
                axios.get(`${API_BASE}/admin/stats`, config).catch(() => null),
                axios.get(`${API_BASE}/admin/users`, config).catch(() => null),
                axios.get(`${API_BASE}/admin/delivery`, config).catch(() => null),
                axios.get(`${API_BASE}/admin/pending-restaurants`, config).catch(() => null),
                axios.get(`${API_BASE}/admin/revenue`, config).catch(() => null),
                axios.get(`${API_BASE}/admin/restaurants/all`, config).catch(() => null),
                axios.get(`${API_BASE}/admin/orders`, config).catch(() => null),
            ]);

            if (resStats?.data?.success) setStats(prev => ({ ...prev, ...resStats.data.data }));
            if (resUsers?.data?.success) setUsersList(resUsers.data.data);
            if (resDel?.data?.success) setDeliveryList(resDel.data.data);
            if (resRev?.data?.success && resRev.data.data.length > 0) {
                setRevenueData({ labels: resRev.data.data.map(r => r.month), data: resRev.data.data.map(r => r.revenue) });
            }
            if (resRest?.data?.success) {
                setPendingRestaurants(resRest.data.data.map(r => ({
                    id: r.res_id, name: r.res_name, type: r.type,
                    location: r.res_address, status: 'Pending',
                    img: r.res_img || ''
                })));
            }
            if (resAllRest?.data?.success) {
                setAllRestaurants(resAllRest.data.data.map(r => ({
                    id: r.res_id, name: r.res_name, type: r.type, location: r.res_address,
                    status: r.is_approved === 1 ? 'Approved' : r.is_approved === -1 ? 'Rejected' : 'Pending',
                    img: r.res_img || ''
                })));
            }
            if (resAllOrders?.data?.success) setOrdersList(resAllOrders.data.data);
        } catch (err) {
            console.error('Data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAllData(); }, []);

    // SSE connection for real-time logs
    const connectSSE = useCallback(() => {
        if (sseRef.current) sseRef.current.close();
        const token = localStorage.getItem('token');
        if (!token) return;
        const url = `${API_BASE}/admin/logs/stream?token=${encodeURIComponent(token)}`;
        const es = new EventSource(url);
        sseRef.current = es;
        es.onopen = () => setLogConnected(true);
        es.onmessage = (ev) => {
            try {
                const entry = JSON.parse(ev.data);
                setRealTimeLogs(prev => {
                    const next = [...prev, entry];
                    return next.length > 500 ? next.slice(-500) : next;
                });
            } catch (_) {}
        };
        es.onerror = () => {
            setLogConnected(false);
            es.close();
            sseRef.current = null;
            setTimeout(() => { if (sseRef.current === null) connectSSE(); }, 4000);
        };
    }, []);

    useEffect(() => {
        if (activeTab === 'system') {
            connectSSE();
        } else {
            if (sseRef.current) { sseRef.current.close(); sseRef.current = null; setLogConnected(false); }
        }
        return () => { if (sseRef.current) { sseRef.current.close(); sseRef.current = null; } };
    }, [activeTab, connectSSE]);

    // Auto-scroll
    useEffect(() => {
        if (autoScroll && logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [realTimeLogs, autoScroll]);

    const setLoaderFor = (key, val) => setActionLoading(prev => ({ ...prev, [key]: val }));

    const handleUserStatus = async (id, status) => {
        setLoaderFor(`user-${id}`, true);
        try {
            await axios.post(`${API_BASE}/admin/users/status`, { id, status }, config);
            setUsersList(prev => prev.map(u => u.user_id === id ? { ...u, user_verify: status ? 1 : 0 } : u));
            showNotification(`User ${status ? 'unblocked' : 'blocked'} successfully`);
        } catch { showNotification('Failed to update user status', 'error'); }
        finally { setLoaderFor(`user-${id}`, false); }
    };

    const handleAgentStatus = async (id, status) => {
        setLoaderFor(`agent-${id}`, true);
        try {
            await axios.post(`${API_BASE}/admin/delivery/status`, { id, status }, config);
            setDeliveryList(prev => prev.map(a => a.id === id ? { ...a, status } : a));
            showNotification(`Agent status updated to ${status}`);
        } catch { showNotification('Failed to update agent status', 'error'); }
        finally { setLoaderFor(`agent-${id}`, false); }
    };

    const handleApproveRestaurant = async (type, id, approved) => {
        setLoaderFor(`rest-${id}`, true);
        try {
            await axios.post(`${API_BASE}/admin/approve-restaurant`, { type, id, status: approved }, config);
            setPendingRestaurants(prev => prev.filter(r => r.id !== id));
            await fetchAllData();
            showNotification(`Restaurant ${approved ? 'approved' : 'rejected'} successfully! SMS sent.`);
        } catch { showNotification('Failed to update restaurant', 'error'); }
        finally { setLoaderFor(`rest-${id}`, false); }
    };

    const handleRestaurantToggle = async (type, id, currentStatus) => {
        setLoaderFor(`restToggle-${id}`, true);
        try {
            const newStatus = currentStatus === 'Approved' ? false : true;
            await axios.post(`${API_BASE}/admin/approve-restaurant`, { type, id, status: newStatus }, config);
            await fetchAllData();
            showNotification(`Restaurant ${newStatus ? 'approved' : 'suspended'} successfully`);
        } catch { showNotification('Failed to update restaurant', 'error'); }
        finally { setLoaderFor(`restToggle-${id}`, false); }
    };

    const handleLogout = () => { localStorage.clear(); navigate('/login'); };

    const lineChartData = {
        labels: revenueData.labels,
        datasets: [{
            label: 'Revenue (₹)',
            data: revenueData.data,
            borderColor: '#dc2626',
            backgroundColor: 'rgba(220,38,38,0.08)',
            fill: true, tension: 0.4, borderWidth: 2.5,
            pointBackgroundColor: '#fff', pointBorderColor: '#dc2626', pointBorderWidth: 2, pointRadius: 4,
        }]
    };
    const doughnutData = {
        labels: ['Users', 'Restaurants', 'Agents'],
        datasets: [{
            data: [usersList.length || 1, allRestaurants.length || 0, deliveryList.length || 0],
            backgroundColor: ['#dc2626', '#f59e0b', '#10b981'],
            borderWidth: 0, hoverOffset: 8
        }]
    };
    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { border: { display: false }, grid: { color: '#f3f4f6' } } }
    };

    const menuItems = [
        { id: 'overview',     icon: <FaChartLine />,    label: 'Overview' },
        { id: 'users',        icon: <FaUsers />,         label: 'Users' },
        { id: 'restaurants',  icon: <FaStore />,         label: 'Restaurants' },
        { id: 'delivery',     icon: <FaTruck />,         label: 'Delivery' },
        { id: 'finances',     icon: <FaMoneyBillWave />, label: 'Finances' },
        { id: 'system',       icon: <FaDatabase />,      label: 'System Logs' },
        { id: 'settings',     icon: <FaCog />,           label: 'Settings' },
    ];

    const tabTitles = {
        overview: 'Dashboard Overview', users: 'User Management',
        restaurants: 'Restaurant Management', delivery: 'Delivery Network',
        finances: 'Financials & Orders', system: 'System Logs', settings: 'Platform Settings'
    };

    const q = searchQuery.toLowerCase();

    const filteredUsers = usersList.filter(u =>
        u.user_name?.toLowerCase().includes(q) ||
        u.user_gmail?.toLowerCase().includes(q)
    );

    const filteredRestaurants = allRestaurants.filter(r =>
        r.name?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q) ||
        r.type?.toLowerCase().includes(q) ||
        r.status?.toLowerCase().includes(q)
    );

    const filteredDelivery = deliveryList.filter(a =>
        a.name?.toLowerCase().includes(q) ||
        a.user_gmail?.toLowerCase().includes(q) ||
        a.phone?.toLowerCase().includes(q) ||
        a.vehicle_type?.toLowerCase().includes(q) ||
        a.vehicle_number?.toLowerCase().includes(q)
    );

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-950">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400 font-medium">Loading Foodio OS...</p>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* Toast Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -60, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -60, x: '-50%' }}
                        className={`fixed top-6 left-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl text-white text-sm font-semibold flex items-center gap-2 ${notification.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}
                    >
                        {notification.type === 'error' ? <FaTimesCircle /> : <FaCheckCircle />}
                        {notification.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Sidebar ─── */}
            <motion.aside
                animate={{ width: isSidebarOpen ? 256 : 72 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-gray-950 text-white h-full flex flex-col shadow-2xl z-30 flex-shrink-0 overflow-hidden"
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-center border-b border-gray-800 flex-shrink-0">
                    {isSidebarOpen ? (
                        <div className="flex items-center gap-2 select-none">
                            {/* <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center"> */}
                                {/* <FaShieldAlt className="text-white text-sm" /> */}
                                <img src={logo} alt="" className="w-8 h-8" />
                            {/* </div> */}
                            <div>
                                <span className="text-red-500 font-black text-lg tracking-tight">FOOD</span>
                                <span className="text-white font-black text-lg tracking-tight">IO</span>
                                <span className="ml-1 text-[9px] bg-red-600/20 text-red-400 border border-red-800 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">OS</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                            <FaShieldAlt className="text-white text-sm" />
                        </div>
                    )}
                </div>

                {/* Nav items */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            title={!isSidebarOpen ? item.label : ''}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group ${
                                activeTab === item.id
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <span className="text-base flex-shrink-0">{item.icon}</span>
                            <AnimatePresence>
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="whitespace-nowrap overflow-hidden"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                            {item.id === 'restaurants' && pendingRestaurants.length > 0 && (
                                <span className={`ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${!isSidebarOpen ? 'absolute right-2 top-2' : ''}`}>
                                    {pendingRestaurants.length}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Admin Profile + Logout */}
                <div className="border-t border-gray-800 p-3 space-y-1 flex-shrink-0">
                    {isSidebarOpen && (
                        <div className="flex items-center gap-3 px-2 py-2 mb-1">
                            <img
                                src={adminAvatar}
                                className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                                alt="Admin"
                            />
                            <div className="overflow-hidden">
                                <p className="text-white font-semibold text-sm truncate">{adminName}</p>
                                <p className="text-gray-500 text-[10px] truncate">{adminEmail}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-950 hover:text-red-400 transition-all text-sm font-medium"
                    >
                        <FaSignOutAlt className="flex-shrink-0" />
                        {isSidebarOpen && <span>Log Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* ─── Main Content ─── */}
            <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">

                {/* ─── Header ─── */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                        >
                            <FaBars className="text-sm" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-none">{tabTitles[activeTab]}</h1>
                            <p className="text-xs text-gray-400 mt-0.5">Foodio Platform Control Center</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:block">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                                type="text"
                                placeholder="Search users, restaurants..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-56 transition-all text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        <button 
                            onClick={() => pendingRestaurants.length > 0 && setActiveTab('restaurants')}
                            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                                pendingRestaurants.length > 0 ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <FaBell className="text-sm" />
                            {pendingRestaurants.length > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                                    {pendingRestaurants.length}
                                </span>
                            )}
                        </button>

                        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
                            <img
                                src={adminAvatar}
                                className="w-9 h-9 rounded-xl object-cover"
                                alt="Admin"
                            />
                            <div className="hidden lg:block">
                                <p className="text-sm font-semibold text-gray-800 leading-none">{adminName}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{adminEmail}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ─── Page Body ─── */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <AnimatePresence mode="wait">

                        {/* ══ OVERVIEW ══ */}
                        {activeTab === 'overview' && (
                            <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 max-w-7xl mx-auto">
                                {/* Stat Cards */}
                                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                                    {[
                                        { title: 'Total Revenue', value: `₹${Number(stats.totalRevenue || 0).toLocaleString()}`, sub: 'Delivered orders', icon: <FaMoneyBillWave />, gradient: 'from-emerald-500 to-emerald-700', trend: '+14.5%', up: true },
                                        { title: 'Total Orders', value: Number(stats.totalOrders || 0).toLocaleString(), sub: 'All time orders', icon: <FaBox />, gradient: 'from-red-500 to-red-700', trend: '+5.2%', up: true },
                                        { title: 'Registered Users', value: Number(stats.totalUsers || 0).toLocaleString(), sub: 'Active customers', icon: <FaUsers />, gradient: 'from-blue-500 to-blue-700', trend: '+12.1%', up: true },
                                        { title: 'Delivery Fleet', value: deliveryList.filter(d => d.status === 'active').length.toString(), sub: 'Active agents', icon: <FaTruck />, gradient: 'from-orange-500 to-orange-700', trend: '2 pending', up: false },
                                    ].map((s, i) => (
                                        <motion.div key={i} whileHover={{ y: -3 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white text-lg shadow-lg`}>
                                                    {s.icon}
                                                </div>
                                                <span className={`text-xs font-semibold flex items-center gap-1 ${s.up ? 'text-emerald-600' : 'text-orange-500'}`}>
                                                    {s.up ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
                                                    {s.trend}
                                                </span>
                                            </div>
                                            <p className="text-2xl font-black text-gray-900">{s.value}</p>
                                            <p className="text-xs text-gray-500 mt-1 font-medium">{s.title}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Charts */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-5">
                                            <div>
                                                <h3 className="font-bold text-gray-900">Revenue Analytics</h3>
                                                <p className="text-xs text-gray-500 mt-0.5">Monthly revenue from delivered orders</p>
                                            </div>
                                            <span className="text-xs bg-red-50 text-red-600 font-bold px-3 py-1 rounded-full border border-red-100">Last 6 Months</span>
                                        </div>
                                        <div className="h-60"><Line data={lineChartData} options={chartOptions} /></div>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-1">Platform Entities</h3>
                                        <p className="text-xs text-gray-500 mb-5">Distribution across platform</p>
                                        <div className="h-48 relative flex items-center justify-center">
                                            <Doughnut data={doughnutData} options={{ ...chartOptions, cutout: '72%', scales: {} }} />
                                            <div className="absolute text-center pointer-events-none">
                                                <p className="text-2xl font-black text-gray-900">{usersList.length + allRestaurants.length + deliveryList.length}</p>
                                                <p className="text-[10px] text-gray-500 font-medium">Total</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            {[{ label: 'Users', color: 'bg-red-500', count: usersList.length }, { label: 'Restaurants', color: 'bg-amber-500', count: allRestaurants.length }, { label: 'Agents', color: 'bg-emerald-500', count: deliveryList.length }].map((l, i) => (
                                                <div key={i} className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${l.color}`} /><span className="text-gray-600 font-medium">{l.label}</span></div>
                                                    <span className="font-bold text-gray-800">{l.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Pending Approvals + System Status */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
                                            <h3 className="font-bold text-gray-900">Pending Restaurant Approvals</h3>
                                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                                <FaBell className="text-[10px]" /> {pendingRestaurants.length}
                                            </span>
                                        </div>
                                        <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
                                            {pendingRestaurants.length === 0 ? (
                                                <div className="py-10 text-center text-gray-400 text-sm">
                                                    <FaCheckCircle className="text-3xl mx-auto mb-2 text-gray-300" />
                                                    No pending approvals
                                                </div>
                                            ) : pendingRestaurants.map(r => (
                                                <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-red-50 transition-colors group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center text-red-600 font-black text-lg flex-shrink-0">
                                                            {r.name?.[0] || 'R'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm group-hover:text-red-700">{r.name}</p>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                <FaMapMarkerAlt className="text-[9px]" /> {r.location} &bull; <span className="uppercase font-bold text-red-400">{r.type}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 flex-shrink-0">
                                                        <button
                                                            disabled={actionLoading[`rest-${r.id}`]}
                                                            onClick={() => handleApproveRestaurant(r.type, r.id, true)}
                                                            className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                                                            title="Approve"
                                                        >
                                                            {actionLoading[`rest-${r.id}`] ? <FaSpinner className="animate-spin text-sm" /> : <FaCheckCircle className="text-sm" />}
                                                        </button>
                                                        <button
                                                            disabled={actionLoading[`rest-${r.id}`]}
                                                            onClick={() => handleApproveRestaurant(r.type, r.id, false)}
                                                            className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                                            title="Reject"
                                                        >
                                                            <FaTimesCircle className="text-sm" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-950 rounded-2xl border border-gray-800 shadow-sm overflow-hidden">
                                        <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <h3 className="font-bold text-white">System Status</h3>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            {[
                                                { label: 'API Gateway', status: 'Healthy', ping: '24ms' },
                                                { label: 'MySQL Database', status: 'Healthy', ping: '18ms' },
                                                { label: 'Redis Cache', status: 'Healthy', ping: '8ms' },
                                                { label: 'Twilio SMS', status: 'Active', ping: 'Live' },
                                            ].map((service, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                                                        <span className="text-sm text-gray-300 font-medium">{service.label}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-emerald-400 text-xs font-bold">{service.status}</p>
                                                        <p className="text-gray-600 text-xs">{service.ping}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ══ USERS ══ */}
                        {activeTab === 'users' && (
                            <motion.div key="users" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900">Platform Customers</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">{filteredUsers.length} users found</p>
                                        </div>
                                        <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">{usersList.length} Total</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {filteredUsers.map(u => (
                                                    <tr key={u.user_id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">
                                                                    {u.user_name?.[0]?.toUpperCase() || 'U'}
                                                                </div>
                                                                <span className="font-semibold text-gray-900 text-sm">{u.user_name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            <p>{u.user_gmail}</p>
                                                            <p className="text-xs text-gray-400">{u.user_phone || '—'}</p>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${u.user_verify ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${u.user_verify ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                                {u.user_verify ? 'Active' : 'Blocked'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <button
                                                                disabled={!!actionLoading[`user-${u.user_id}`]}
                                                                onClick={() => handleUserStatus(u.user_id, !u.user_verify)}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ${u.user_verify ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                                                            >
                                                                {actionLoading[`user-${u.user_id}`] ? '...' : u.user_verify ? 'Block' : 'Unblock'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {filteredUsers.length === 0 && (
                                            <div className="py-16 text-center text-gray-400">
                                                <FaUsers className="text-4xl mx-auto mb-3 text-gray-200" />
                                                <p className="font-medium">No users found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ══ RESTAURANTS ══ */}
                        {activeTab === 'restaurants' && (
                            <motion.div key="restaurants" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto space-y-6">
                                {/* Pending section */}
                                {pendingRestaurants.length > 0 && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
                                        <div className="px-6 py-4 border-b border-amber-200 flex items-center justify-between">
                                            <h3 className="font-bold text-amber-900 flex items-center gap-2"><FaBell className="text-amber-600" /> Pending Approvals</h3>
                                            <span className="bg-amber-200 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">{pendingRestaurants.length} waiting</span>
                                        </div>
                                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {pendingRestaurants.map(r => (
                                                <div key={r.id} className="bg-white rounded-xl p-4 border border-amber-100 flex items-center justify-between gap-3 shadow-sm">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-base flex-shrink-0">{r.name?.[0]}</div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-gray-900 text-sm truncate">{r.name}</p>
                                                            <p className="text-xs text-gray-500 truncate">{r.location} · <span className="uppercase font-bold text-amber-600">{r.type}</span></p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 flex-shrink-0">
                                                        <button disabled={actionLoading[`rest-${r.id}`]} onClick={() => handleApproveRestaurant(r.type, r.id, true)} className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50">
                                                            {actionLoading[`rest-${r.id}`] ? <FaSpinner className="animate-spin text-sm" /> : <FaCheckCircle className="text-sm" />}
                                                        </button>
                                                        <button disabled={actionLoading[`rest-${r.id}`]} onClick={() => handleApproveRestaurant(r.type, r.id, false)} className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all disabled:opacity-50">
                                                            <FaTimesCircle className="text-sm" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* All Restaurants */}
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900">All Restaurants</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">{filteredRestaurants.length} found</p>
                                        </div>
                                        <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">{allRestaurants.length} Total</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Restaurant</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {filteredRestaurants.map(r => (
                                                    <tr key={`${r.type}-${r.id}`} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-red-600 font-black flex-shrink-0">
                                                                    {r.name?.[0] || 'R'}
                                                                </div>
                                                                <span className="font-semibold text-gray-900 text-sm">{r.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4"><span className="uppercase text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{r.type}</span></td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">{r.location || '—'}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${r.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : r.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'Approved' ? 'bg-emerald-500' : r.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
                                                                {r.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <button
                                                                disabled={!!actionLoading[`restToggle-${r.id}`]}
                                                                onClick={() => handleRestaurantToggle(r.type, r.id, r.status)}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ${r.status === 'Approved' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                                                            >
                                                                {actionLoading[`restToggle-${r.id}`] ? '...' : r.status === 'Approved' ? 'Suspend' : 'Approve'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {filteredRestaurants.length === 0 && (
                                            <div className="py-16 text-center text-gray-400">
                                                <FaStore className="text-4xl mx-auto mb-3 text-gray-200" />
                                                <p className="font-medium">{searchQuery ? `No restaurants match "${searchQuery}"` : 'No restaurants found'}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ══ DELIVERY ══ */}
                        {activeTab === 'delivery' && (
                            <motion.div key="delivery" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900">Delivery Agents</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {filteredDelivery.filter(d => ['available', 'on-duty', 'offline'].includes(d.status)).length} approved · {filteredDelivery.length} found
                                            </p>
                                        </div>
                                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">{deliveryList.length} Total</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Agent</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {filteredDelivery.map(a => (
                                                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 font-bold text-sm flex-shrink-0">
                                                                    {a.name?.[0]?.toUpperCase() || 'D'}
                                                                </div>
                                                                <span className="font-semibold text-gray-900 text-sm">{a.name}</span>

                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                            <p>{a.user_gmail || '—'}</p>
                                                            <p className="text-xs text-gray-400">{a.phone || '—'}</p>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">
                                                            <p className="capitalize">{a.vehicle_type || '—'}</p>
                                                            <p className="font-mono text-xs font-bold text-gray-800">{a.vehicle_number || ''}</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${['available', 'on-duty', 'offline'].includes(a.status) ? 'bg-emerald-50 text-emerald-700' : a.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${['available', 'on-duty', 'offline'].includes(a.status) ? 'bg-emerald-500' : a.status === 'rejected' ? 'bg-red-500' : 'bg-gray-400'}`} />
                                                                {a.status?.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex gap-2">
                                                                {!['available', 'on-duty', 'offline'].includes(a.status) && (
                                                                    <button disabled={!!actionLoading[`agent-${a.id}`]} onClick={() => handleAgentStatus(a.id, 'available')} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-200 transition-colors disabled:opacity-50">
                                                                        {actionLoading[`agent-${a.id}`] ? '...' : 'Approve'}
                                                                    </button>
                                                                )}
                                                                {a.status !== 'rejected' && (
                                                                    <button disabled={!!actionLoading[`agent-${a.id}`]} onClick={() => handleAgentStatus(a.id, 'rejected')} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors disabled:opacity-50">
                                                                        Reject
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {filteredDelivery.length === 0 && (
                                            <div className="py-16 text-center text-gray-400">
                                                <FaTruck className="text-4xl mx-auto mb-3 text-gray-200" />
                                                <p className="font-medium">{searchQuery ? `No agents match "${searchQuery}"` : 'No delivery agents found'}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ══ FINANCES ══ */}
                        {activeTab === 'finances' && (
                            <motion.div key="finances" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto space-y-6">
                                {/* Finance Summary */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: 'Total Revenue', value: `₹${Number(stats.totalRevenue || 0).toLocaleString()}`, color: 'text-emerald-600 bg-emerald-50' },
                                        { label: 'Total Orders', value: ordersList.length, color: 'text-blue-600 bg-blue-50' },
                                        { label: 'Delivered', value: ordersList.filter(o => o.status === 'Delivered').length, color: 'text-purple-600 bg-purple-50' },
                                    ].map((s, i) => (
                                        <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                                            <p className={`text-2xl font-black ${s.color.split(' ')[0]}`}>{s.value}</p>
                                            <p className="text-xs text-gray-500 font-medium mt-1">{s.label}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900">All Orders</h3>
                                        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">₹{Number(stats.totalRevenue || 0).toLocaleString()} Revenue</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {ordersList.map(o => (
                                                    <tr key={o.order_id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 font-mono font-bold text-gray-800 text-sm">#{o.order_id}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">User #{o.user_id}</td>
                                                        <td className="px-6 py-4 text-sm text-gray-500">{o.created_at ? new Date(o.created_at).toLocaleDateString('en-IN') : '—'}</td>
                                                        <td className="px-6 py-4 font-bold text-emerald-700 text-sm">₹{parseFloat(o.total_amount || 0).toFixed(2)}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : o.status === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                                                {o.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {ordersList.length === 0 && <div className="py-16 text-center text-gray-400"><FaMoneyBillWave className="text-4xl mx-auto mb-3 text-gray-200" /><p>No orders found</p></div>}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ══ SYSTEM LOGS ══ */}
                        {activeTab === 'system' && (() => {
                            const filteredLogs = logFilter === 'ALL' ? realTimeLogs : realTimeLogs.filter(l => l.level === logFilter);
                            return (
                            <motion.div key="system" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto space-y-4">

                                {/* Toolbar */}
                                <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3">
                                    {/* Level Filter Tabs */}
                                    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                                        {['ALL','INFO','WARN','ERROR','DEBUG'].map(lvl => (
                                            <button
                                                key={lvl}
                                                onClick={() => setLogFilter(lvl)}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                                    logFilter === lvl
                                                        ? lvl === 'ERROR' ? 'bg-red-600 text-white shadow'
                                                        : lvl === 'WARN'  ? 'bg-yellow-500 text-white shadow'
                                                        : lvl === 'DEBUG' ? 'bg-purple-600 text-white shadow'
                                                        : 'bg-gray-800 text-white shadow'
                                                        : 'text-gray-500 hover:text-gray-800'
                                                }`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Right-side controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setAutoScroll(v => !v)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                                autoScroll ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {autoScroll ? <FaPause className="text-[10px]" /> : <FaPlay className="text-[10px]" />}
                                            {autoScroll ? 'Live' : 'Paused'}
                                        </button>

                                        <button
                                            onClick={() => setRealTimeLogs([])}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all"
                                        >
                                            <FaTrash className="text-[10px]" /> Clear
                                        </button>

                                        <span className="text-xs font-mono text-gray-400 pl-1">{filteredLogs.length} entries</span>

                                        {/* Connection status */}
                                        <div className="flex items-center gap-1.5 pl-3 border-l border-gray-200">
                                            <div className={`w-2 h-2 rounded-full ${
                                                logConnected ? 'bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.9)]' : 'bg-red-400 animate-pulse'
                                            }`} />
                                            <span className={`text-xs font-mono font-bold ${logConnected ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {logConnected ? 'LIVE' : 'RECONNECTING...'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Terminal Window */}
                                <div className="bg-gray-950 rounded-2xl border border-gray-800 overflow-hidden">
                                    {/* Title Bar */}
                                    <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between bg-gray-900/60">
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                            </div>
                                            <span className="text-gray-400 text-sm font-mono">foodio-os — system.log</span>
                                        </div>
                                        <span className="text-gray-600 text-xs font-mono">
                                            {new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>

                                    {/* Log Lines */}
                                    <div
                                        className="p-5 h-[60vh] overflow-y-auto font-mono text-sm"
                                        onScroll={e => {
                                            const el = e.currentTarget;
                                            const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
                                            if (!atBottom && autoScroll) setAutoScroll(false);
                                            if (atBottom && !autoScroll) setAutoScroll(true);
                                        }}
                                    >
                                        {filteredLogs.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-gray-700">
                                                <FaDatabase className="text-4xl mb-3 opacity-20" />
                                                <p className="text-sm">{logConnected ? 'No log entries yet. Waiting for events...' : 'Connecting to live log stream...'}</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-px">
                                                {filteredLogs.map(log => (
                                                    <div
                                                        key={log.id}
                                                        className="flex gap-3 hover:bg-white/[0.04] px-2 py-0.5 rounded transition-colors group"
                                                    >
                                                        {/* Timestamp */}
                                                        <span className="text-gray-600 whitespace-nowrap text-xs flex-shrink-0 w-20">
                                                            {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour12: false })}
                                                        </span>
                                                        {/* Level */}
                                                        <span className={`whitespace-nowrap text-xs font-black flex-shrink-0 w-14 ${
                                                            log.level === 'ERROR' ? 'text-red-400'
                                                            : log.level === 'WARN'  ? 'text-yellow-400'
                                                            : log.level === 'DEBUG' ? 'text-purple-400'
                                                            : log.level === 'TRACE' ? 'text-gray-500'
                                                            : 'text-blue-400'
                                                        }`}>
                                                            [{log.level}]
                                                        </span>
                                                        {/* Context */}
                                                        <span className="text-orange-400 text-xs whitespace-nowrap flex-shrink-0 w-28 truncate">
                                                            {log.context}
                                                        </span>
                                                        {/* Message */}
                                                        <span className="text-gray-300 text-xs flex-1 break-all">{log.message}</span>
                                                        {/* Extra data (hover reveal) */}
                                                        {log.data && (
                                                            <span className="text-gray-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity truncate max-w-[200px] flex-shrink-0" title={log.data}>
                                                                | {log.data}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div ref={logsEndRef} />
                                    </div>

                                    {/* Footer */}
                                    <div className="px-5 py-2.5 border-t border-gray-800 bg-gray-900/40 flex items-center gap-3">
                                        <span className="text-emerald-400 text-xs animate-pulse">$ _</span>
                                        <span className="text-gray-600 text-xs font-mono">
                                            {logConnected
                                                ? `Stream active · ${realTimeLogs.length} total · filter: ${logFilter} · showing: ${filteredLogs.length}`
                                                : 'Stream disconnected — retrying in 4s...'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                            );
                        })()}

                        {/* ══ SETTINGS ══ */}
                        {activeTab === 'settings' && (
                            <motion.div key="settings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-6">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                                        <h3 className="font-bold text-gray-900">Platform Configuration</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">Manage operational rules, fees, and platform restrictions</p>
                                    </div>
                                    <div className="p-6 space-y-8">
                                        {/* Toggles */}
                                        <div>
                                            <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Operational Controls</h4>
                                            <div className="space-y-5">
                                                {[
                                                    { title: 'Maintenance Mode', desc: 'Temporarily disable app for all customers.', defaultChecked: false },
                                                    { title: 'Accept New Restaurant Registrations', desc: 'Allow new vendors to register on the platform.', defaultChecked: true },
                                                    { title: 'Accept New Delivery Applications', desc: 'Allow new delivery agents to apply.', defaultChecked: true },
                                                    { title: 'SMS Notifications (Twilio)', desc: 'Send SMS to restaurant/agents on status change.', defaultChecked: true },
                                                ].map((t, i) => (
                                                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                                        <div>
                                                            <p className="font-semibold text-gray-800 text-sm">{t.title}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
                                                            <input type="checkbox" defaultChecked={t.defaultChecked} className="sr-only peer" />
                                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600" />
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Fee settings */}
                                        <div>
                                            <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Financial Rules</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    { label: 'Base Delivery Fee (₹)', value: '40' },
                                                    { label: 'Platform Commission (%)', value: '15' },
                                                    { label: 'Min Order Value (₹)', value: '99' },
                                                    { label: 'Max Delivery Distance (km)', value: '25' },
                                                ].map((f, i) => (
                                                    <div key={i}>
                                                        <label className="text-xs font-bold text-gray-600 mb-1.5 block">{f.label}</label>
                                                        <input type="number" defaultValue={f.value} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-red-200 text-sm">
                                            Save Configuration
                                        </button>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                                    <div className="px-6 py-4 border-b border-red-100 bg-red-50/40">
                                        <h3 className="font-bold text-red-900">Danger Zone</h3>
                                        <p className="text-xs text-red-500 mt-0.5">Irreversible and destructive actions</p>
                                    </div>
                                    <div className="p-6 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-800 text-sm">Clear All Cache</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Flush Redis cache and force DB refresh for all users.</p>
                                        </div>
                                        <button className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors">
                                            Flush Cache
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </main>
            </div>

            {/* ─── Global Notifications ─── */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border ${
                            notification.type === 'error'
                                ? 'bg-red-50 border-red-100 text-red-800'
                                : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                        }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            notification.type === 'error' ? 'bg-red-200 text-red-700' : 'bg-emerald-200 text-emerald-700'
                        }`}>
                            {notification.type === 'error' ? <FaTimesCircle /> : <FaCheckCircle />}
                        </div>
                        <div className="pr-4">
                            <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-0.5">
                                {notification.type === 'error' ? 'Error' : 'Success'}
                            </p>
                            <p className="text-sm font-bold">{notification.msg}</p>
                        </div>
                        <button 
                            onClick={() => setNotification(null)}
                            className="bg-white/50 hover:bg-white p-1 rounded-lg transition-colors"
                        >
                            <FaTimesCircle className="text-gray-400" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SuperAdminDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalUsers: 0, activeUsers: 0 });
    const [pendingRestaurants, setPendingRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [statsRes, pendingRes] = await Promise.all([
                    axios.get('/api/admin/stats'),
                    axios.get('/api/admin/pending-restaurants')
                ]);

                if (statsRes.data.success) setStats(statsRes.data.data);
                if (pendingRes.data.success) setPendingRestaurants(pendingRes.data.data);
                
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch admin data:', error);
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const handleApprove = async (type, id, status) => {
        try {
            const res = await axios.post('/api/admin/approve-restaurant', { type, id, status });
            if (res.data.success) {
                setPendingRestaurants(prev => prev.filter(r => r.res_id !== id));
            }
        } catch (error) {
            console.error('Approval/rejection failed:', error);
        }
    };

    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Monthly Revenue (₹)',
            data: [12000, 19000, 30000, 50000, 25000, 60000], 
            backgroundColor: 'rgba(255, 71, 87, 0.7)',
            borderRadius: 8
        }]
    };

    const userData = {
        labels: ['Active', 'Inactive'],
        datasets: [{
            data: [stats.activeUsers, stats.totalUsers - stats.activeUsers],
            backgroundColor: ['#2ed573', '#ff4757'],
            hoverOffset: 4
        }]
    };

    if (loading) {
        return (
            <div className="mt-12 p-6 space-y-4 max-w-7xl mx-auto min-h-screen bg-gray-50 pt-10">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-4 items-center bg-white p-6 rounded-2xl border border-gray-100">
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
        <div className="min-h-screen bg-gray-50 p-8 mt-12    font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Admin <span className="text-red-500">Dashboard</span></h1>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-medium">Welcome, Super Admin 👋</span>
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold border-2 border-red-500">SA</div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
                        { label: 'Total Orders', value: stats.totalOrders, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
                        { label: 'Total Users', value: stats.totalUsers, color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
                        { label: 'Active Users', value: stats.activeUsers, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' }
                    ].map((stat, idx) => (
                        <motion.div 
                            key={idx}
                            whileHover={{ y: -5 }}
                            className={`p-6 rounded-2xl bg-white shadow-sm border ${stat.border}`}
                        >
                            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{stat.label}</h3>
                            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                            <span className={`inline-block mt-3 px-2 py-1 rounded-full text-xs font-bold ${stat.color}`}>+12% Increase</span>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Revenue Growth</h3>
                        <div className="h-64"><Bar data={revenueData} options={{ maintainAspectRatio: false }} /></div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">User Engagement</h3>
                        <div className="h-64 flex justify-center"><Pie data={userData} options={{ maintainAspectRatio: false }} /></div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">Pending Restaurant Approvals</h3>
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">{pendingRestaurants.length} Pending</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">Restaurant</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Address</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pendingRestaurants.map(r => (
                                    <tr key={r.res_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={r.res_img} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                <span className="font-semibold text-gray-800">{r.res_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-bold uppercase text-gray-600">{r.type}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{r.res_address}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button 
                                                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors"
                                                    onClick={() => handleApprove(r.type, r.res_id, true)}
                                                >Approve</button>
                                                <button 
                                                    className="px-4 py-2 bg-red-100 text-red-500 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                                                    onClick={() => handleApprove(r.type, r.res_id, false)}
                                                >Reject</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {pendingRestaurants.length === 0 && (
                        <div className="p-20 text-center text-gray-400 font-medium italic">All caught up! No pending approvals.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

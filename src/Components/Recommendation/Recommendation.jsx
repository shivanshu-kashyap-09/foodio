import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Recommendation = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await axios.get('/api/ai/recommend');
                if (res.data.success) {
                    setRecommendations(res.data.data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch recommendations:', error);
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="mt-20 p-6 space-y-4 max-w-7xl mx-auto py-20">
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
    if (recommendations.length === 0) return null;

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto font-sans">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-l-4 border-red-500 pl-6 rounded-sm">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3 italic">
                        ✨ Recommended <span className="text-red-500">for You</span>
                        <div className="px-2 py-0.5 bg-red-100 text-red-500 text-[10px] font-bold rounded uppercase not-italic">AI Powered</div>
                    </h2>
                    <p className="text-gray-500 font-medium text-lg mt-2">AI-curated selections based on your unique taste buds</p>
                </div>
            </header>

            <div className="flex overflow-x-auto gap-8 pb-10 scrollbar-hide px-2">
                {recommendations.map((item, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index} 
                        className="min-w-[320px] md:min-w-[380px] bg-white rounded-[40px] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-red-100 transition-all duration-500"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <motion.img 
                                whileHover={{ scale: 1.1 }}
                                src={item.img} 
                                alt={item.name} 
                                className="w-full h-full object-cover transition-transform duration-700"
                            />
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black tracking-widest text-red-600 shadow-sm flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                {item.match}% MATCH
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight leading-tight flex-1">{item.name}</h3>
                                <div className="text-red-500 font-black text-xl">₹{item.price || 249}</div>
                            </div>
                            <p className="text-gray-400 text-sm font-medium mb-6 leading-relaxed line-clamp-2 italic">"{item.reason || 'Highly rated for its aromatic spices and authentic taste.'}"</p>
                            <Link 
                                to={`/dishdetail`} 
                                className="inline-flex items-center justify-center w-full py-4 bg-gray-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-red-500 transition-colors shadow-lg shadow-gray-200"
                            >
                                Savor Now
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7"/></svg>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Recommendation;

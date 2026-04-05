import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FaStar, 
  FaUtensils, 
  FaFilter, 
  FaTimes, 
  FaChevronDown, 
  FaHistory, 
  FaArrowLeft,
  FaSearch,
  FaSpinner
} from 'react-icons/fa';
import SearchBar from '../Components/SearchBar';
import DishCard from '../Components/DishCard';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    
    // Filter states
    const [filters, setFilters] = useState({
        cuisineTypes: 'veg,nonveg,southindian',
        minPrice: '',
        maxPrice: '',
        minRating: '',
    });
    const [showFilters, setShowFilters] = useState(false);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                q: query,
                page,
                limit: 12,
                ...filters
            });
            const res = await axios.get(`${import.meta.env.VITE_URL}/search/filter?${params.toString()}`);
            setResults(res.data.data.items);
            setTotal(res.data.data.total);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [query, page, filters]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(1);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-red-50/50 to-pink-50/50">
            <div className="max-w-[1400px] mx-auto px-6">
                
                {/* Search Bar Header */}
                <div className="mb-12">
                    <Link to="/" className="inline-flex items-center text-red-600 font-bold mb-6 hover:text-red-700 transition-colors">
                        <FaArrowLeft className="mr-2" /> Back to Home
                    </Link>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 w-full">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">Search Results</h1>
                            <p className="text-gray-500 font-medium">Found <span className="text-red-600 font-bold">{total}</span> delicious options for <span className="italic text-gray-800">"{query}"</span></p>
                        </div>
                        <SearchBar className="max-w-[500px]" />
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-[2.5rem] shadow-xl p-6 md:p-10 border border-red-50 mb-12">
                    <div className="flex items-center justify-between mb-8 overflow-x-auto no-scrollbar gap-4">
                        <div className="flex items-center gap-6">
                            <span className="bg-red-600 text-white p-3 rounded-2xl shadow-lg border-2 border-red-400">
                                <FaFilter />
                            </span>
                            <h2 className="text-2xl font-bold text-gray-800 hidden md:block">Filter Flavors</h2>
                        </div>
                        <div className="flex flex-wrap gap-4 items-center">
                            {/* Cuisine Type Filter */}
                            <div className="relative group">
                                <select 
                                    className="appearance-none bg-red-50/50 border-2 border-red-100 rounded-2xl px-6 py-3.5 pr-12 text-sm font-bold text-red-700 focus:outline-none focus:border-red-400 transition-all cursor-pointer"
                                    value={filters.cuisineTypes}
                                    onChange={(e) => handleFilterChange('cuisineTypes', e.target.value)}
                                >
                                    <option value="veg,nonveg,southindian">All Cuisines</option>
                                    <option value="veg">Vegetarian</option>
                                    <option value="nonveg">Non-Vegetarian</option>
                                    <option value="southindian">South Indian</option>
                                </select>
                                <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-red-400 text-xs" />
                            </div>

                            {/* Price Filter */}
                            <div className="relative group">
                                <select 
                                    className="appearance-none bg-red-50/50 border-2 border-red-100 rounded-2xl px-6 py-3.5 pr-12 text-sm font-bold text-red-700 focus:outline-none focus:border-red-400 transition-all cursor-pointer"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                >
                                    <option value="">Budget Friendly</option>
                                    <option value="200">Under ₹200</option>
                                    <option value="500">Under ₹500</option>
                                    <option value="1000">Under ₹1000</option>
                                </select>
                                <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-red-400 text-xs" />
                            </div>

                            {/* Rating Filter */}
                            <div className="relative group">
                                <select 
                                    className="appearance-none bg-red-50/50 border-2 border-red-100 rounded-2xl px-6 py-3.5 pr-12 text-sm font-bold text-red-700 focus:outline-none focus:border-red-400 transition-all cursor-pointer"
                                    value={filters.minRating}
                                    onChange={(e) => handleFilterChange('minRating', e.target.value)}
                                >
                                    <option value="">Top Rated</option>
                                    <option value="4.5">4.5+ ★★★★★</option>
                                    <option value="4">4.0+ ★★★★☆</option>
                                    <option value="3">3.0+ ★★★☆☆</option>
                                </select>
                                <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-red-400 text-xs" />
                            </div>

                            <button 
                                onClick={() => setFilters({ cuisineTypes: 'veg,nonveg,southindian', minPrice: '', maxPrice: '', minRating: '' })}
                                className="text-gray-400 hover:text-red-500 font-bold text-sm px-4 underline underline-offset-4 transition-colors"
                            >
                                Reset All
                            </button>
                        </div>
                    </div>

                    {/* Results Grid */}
                    {loading ? (
                        <div className="py-32 flex flex-col items-center justify-center">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full shadow-2xl mb-6 shadow-red-200"
                            />
                            <p className="text-red-600 font-bold text-xl animate-pulse">Scanning the kitchen...</p>
                        </div>
                    ) : results.length > 0 ? (
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            <AnimatePresence>
                                {results.map((item) => (
                                    <motion.div 
                                        key={`${item.menu_id}-${item.cuisineType}`} 
                                        variants={cardVariants}
                                        whileHover={{ y: -10 }}
                                        className="h-full"
                                    >
                                        <DishCard
                                            dish_id={item.dish_id}
                                            dish_image={item.dish_image}
                                            dish_name={item.dish_name}
                                            dish_price={item.dish_price}
                                            dish_rating={item.dish_rating}
                                            dish_description={item.dish_description}
                                            restaurant_id={item.restaurant_id}
                                            menuType={item.cuisine_type}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <div className="py-32 text-center">
                            <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaUtensils className="text-red-300 text-5xl" />
                            </div>
                            <h3 className="text-3xl font-extrabold text-gray-800 mb-2">Well, this is awkward...</h3>
                            <p className="text-gray-500 max-w-sm mx-auto text-lg">We couldn't find any dishes matching your current search and filters. Try being less specific!</p>
                            <button 
                                onClick={() => setFilters({ cuisineTypes: 'veg,nonveg,southindian', minPrice: '', maxPrice: '', minRating: '' })}
                                className="mt-8 bg-red-600 text-white px-10 py-4 rounded-3xl font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-200"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                    
                    {/* Pagination */}
                    {total > 12 && (
                        <div className="mt-16 flex justify-center items-center gap-4">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold transition-all border-2 ${
                                    page === 1 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-red-500 text-red-600 hover:bg-red-500 hover:text-white shadow-xl shadow-red-100'
                                }`}
                            >
                                <FaArrowLeft />
                            </button>
                            <div className="bg-red-600 text-white h-14 px-8 rounded-2xl flex items-center justify-center font-bold shadow-xl shadow-red-200">
                                {page} / {Math.ceil(total / 12)}
                            </div>
                            <button 
                                disabled={page >= Math.ceil(total / 12)}
                                onClick={() => setPage(page + 1)}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold transition-all border-2 ${
                                    page >= Math.ceil(total / 12) ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-red-500 text-red-600 hover:bg-red-500 hover:text-white shadow-xl shadow-red-100'
                                }`}
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                    )}
                </div>

                {/* Recently Viewed or Suggestions (Static for now) */}
                <div className="mt-20">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="w-12 h-1 bg-gradient-to-r from-red-600 to-transparent rounded-full" />
                        <h2 className="text-3xl font-bold text-gray-800">Trending Now</h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6 opacity-60">
                        {/* Placeholder for trending */}
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-red-50/30">
                                <div className="w-full h-32 bg-gray-100 rounded-2xl mb-3 animate-pulse" />
                                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse mb-2" />
                                <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const FaArrowRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default SearchResults;

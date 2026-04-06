import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaSearch, FaArrowRight, FaUtensils, FaTimes, FaHistory } from 'react-icons/fa';

const SearchBar = ({ className = "", isCompact = false }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState(JSON.parse(localStorage.getItem('search_history') || '[]'));
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.trim().length < 2) {
                setSuggestions([]);
                return;
            }
            setIsLoading(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_URL}/search/suggestions?q=${query}&limit=5`);
                setSuggestions(res.data.data.suggestions);
            } catch (err) {
                console.error('Suggestions error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (searchTerm) => {
        const term = searchTerm || query;
        if (!term.trim()) return;

        // Save to history
        const newHistory = [term, ...history.filter(h => h !== term)].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('search_history', JSON.stringify(newHistory));

        setIsFocused(false);
        navigate(`/search?q=${encodeURIComponent(term)}`);
    };

    return (
        <div ref={searchRef} className={`relative max-w-2xl w-full mx-auto ${className}`}>
            <motion.div 
                animate={{ 
                    scale: isFocused ? 1.02 : 1,
                    boxShadow: isFocused ? '0 15px 30px rgba(220, 38, 38, 0.12)' : '0 8px 16px rgba(0,0,0,0.04)'
                }}
                className={`relative group bg-white border-2 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transition-all duration-300 ${
                    isFocused ? 'border-red-500' : 'border-red-50 hover:border-red-100'
                }`}
            >
                <div className={`flex items-center px-4 md:px-6 ${isCompact ? 'h-10 md:h-12' : 'h-14 md:h-16'}`}>
                    <FaSearch className={`transition-colors duration-300 ${isCompact ? 'text-sm' : 'text-xl'} ${isFocused ? 'text-red-500' : 'text-gray-400 group-hover:text-red-400'}`} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder={isCompact ? "Search..." : "Search for best thalis, dishes, or restaurants..."}
                        className={`flex-1 px-3 md:px-4 focus:outline-none bg-transparent text-gray-800 placeholder-gray-400 font-medium ${isCompact ? 'text-sm' : 'text-base md:text-lg'}`}
                    />
                    <AnimatePresence>
                        {query && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                onClick={() => setQuery('')}
                                className="p-1.5 md:p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <FaTimes className={isCompact ? "text-xs" : ""} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                    {!isCompact && (
                        <button 
                            onClick={() => handleSearch()}
                            className="ml-2 bg-red-600 text-white p-3 rounded-2xl hover:bg-red-700 transition-all hover:shadow-lg active:scale-95"
                        >
                            <FaArrowRight className="text-sm" />
                        </button>
                    )}
                </div>

                {/* Loading Indicator */}
                {isLoading && (
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-400 to-red-600/50"
                    />
                )}
            </motion.div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
                {isFocused && (query.length > 0 || history.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-red-50 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(220,38,38,0.2)] overflow-hidden z-[60] p-4"
                    >
                        {/* History */}
                        {!query && history.length > 0 && (
                            <div className="mb-4">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-4 mb-3 flex items-center">
                                    <FaHistory className="mr-2" /> Recent Searches
                                </p>
                                <div className="space-y-1">
                                    {history.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSearch(item)}
                                            className="w-full flex items-center px-4 py-3 hover:bg-red-50 rounded-2xl group transition-all"
                                        >
                                            <span className="text-gray-400 group-hover:text-red-500 transition-colors mr-3 text-sm">
                                                <FaSearch />
                                            </span>
                                            <span className="text-gray-600 font-semibold group-hover:text-red-600 transition-colors flex-1 text-left">{item}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search Suggestions */}
                        {query && suggestions.length > 0 ? (
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-4 mb-3">Matching results</p>
                                <div className="space-y-1">
                                    {suggestions.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSearch(item)}
                                            className="w-full flex items-center px-4 py-3 hover:bg-red-50 rounded-2xl group transition-all"
                                        >
                                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-red-200 transition-colors">
                                                <FaUtensils className="text-red-500 text-sm" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <p className="text-gray-800 font-bold group-hover:text-red-600 transition-colors">{item}</p>
                                                <p className="text-[10px] text-gray-400">Popular choice in Foodio</p>
                                            </div>
                                            <FaArrowRight className="text-gray-300 group-hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : query && !isLoading && (
                            <div className="p-8 text-center text-gray-400">
                                <FaUtensils className="mx-auto text-3xl mb-3 opacity-20" />
                                <p className="font-bold">No exact matches found</p>
                                <p className="text-xs uppercase tracking-wider mt-1">Try searching for something else</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;

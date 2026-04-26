import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../assets/logo.png";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import SearchBar from './SearchBar';
import {
    FaUser, FaShoppingBag, FaHeart, FaHome, FaUtensils, FaPhoneAlt,
    FaSignOutAlt, FaUserCog, FaTachometerAlt, FaBars, FaTimes, FaSearch
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [editForm, setEditForm] = useState({
        user_name: '',
        user_phone: '',
        user_address: '',
        user_img: null
    });

    const navigate = useNavigate();
    const location = useLocation();
    const USER_ID = localStorage.getItem('user_id');
    const USER = localStorage.getItem('user');
    const headerRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const syncUser = () => {
            const userData = JSON.parse(localStorage.getItem("user"));
            setUser(userData);
            if (userData) {
                setEditForm({
                    user_name: userData.user_name || '',
                    user_phone: userData.user_phone || '',
                    user_address: userData.user_address || '',
                    user_img: null
                });
            }
        };

        window.addEventListener("storage", syncUser);
        syncUser();

        return () => window.removeEventListener("storage", syncUser);
    }, []);

    useEffect(() => {
        const handleProfile = async () => {
            if (!USER_ID) return;
            try {
                const res = await axios.get(`${import.meta.env.VITE_URL}/user/profile`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (res.status === 200) {
                    setUser(res.data.data);
                    localStorage.setItem("user", JSON.stringify(res.data.data));
                }
            } catch (error) {
                console.error(error);
            }
        };
        handleProfile();
    }, [USER_ID]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (headerRef.current && !headerRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        setIsProfileDropdownOpen(false);
        toast.info("Logged out successfully");
        navigate("/login");
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading("Updating profile...");
        try {
            const formData = new FormData();
            formData.append('user_name', editForm.user_name);
            formData.append('user_phone', editForm.user_phone);
            formData.append('user_address', editForm.user_address);
            if (editForm.user_img) {
                formData.append('user_img', editForm.user_img);
            }

            const res = await axios.put(`${import.meta.env.VITE_URL}/user/update/profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (res.data.success) {
                setUser(res.data.data);
                localStorage.setItem("user", JSON.stringify(res.data.data));
                setIsEditModalOpen(false);
                toast.update(loadingToast, { render: "Profile updated!", type: "success", isLoading: false, autoClose: 3000 });
            }
        } catch (err) {
            toast.update(loadingToast, { render: "Update failed", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    const navigateToDashboard = () => {
        const role = user?.role || user?.user_role;
        if (role === 'admin' || role === 'SUPER_ADMIN') navigate("/super-admin");
        else if (role === 'delivery') navigate("/delivery");
        else if (role === 'restaurant') navigate("/restaurant/dashboard");
        else navigate("/profile");
        setIsProfileDropdownOpen(false);
    };

    const navItems = [
        { to: "/", label: "Home", icon: <FaHome /> },
        { to: "/restaurant", label: "Menu", icon: <FaUtensils /> },
        { to: "/cart", label: "Cart", icon: <FaShoppingBag /> },
        { to: "/orders", label: "Orders", icon: <FaShoppingBag /> },
        { to: "/wishlist", label: "Wishlist", icon: <FaHeart /> },
        { to: "/contact", label: "Contact", icon: <FaPhoneAlt /> }
    ];

    const isHomePage = location.pathname === "/";
    const headerStyle = (isScrolled || !isHomePage)
        ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100/50 py-1.5 sm:py-2.5'
        : 'bg-transparent py-3 sm:py-5';

    const textColor = (isScrolled || !isHomePage) ? 'text-gray-800' : 'text-white';
    const brandColor = (isScrolled || !isHomePage) ? 'text-red-600' : 'text-white';

    return (
        <>
            <motion.header
                ref={headerRef}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 ${headerStyle}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full gap-4">

                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <motion.img
                            src={logo}
                            alt="logo"
                            className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                            animate={{ rotate: isScrolled ? 360 : 0 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />
                        <h2 className={`font-black text-xl sm:text-2xl lg:text-3xl tracking-tighter leading-none flex items-baseline transition-colors ${brandColor}`}>
                            FOOD<span className={`transition-colors ${(isScrolled || !isHomePage) ? 'text-gray-800' : 'text-white/90'}`}>IO</span>
                        </h2>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all relative overflow-hidden group ${location.pathname === item.to
                                        ? ((isScrolled || !isHomePage) ? 'text-red-600 bg-red-50' : 'text-white bg-white/10')
                                        : ((isScrolled || !isHomePage) ? 'text-gray-500 hover:text-red-600 hover:bg-red-50/50' : 'text-red-100 hover:text-white hover:bg-white/5')
                                    }`}
                            >
                                {item.label}
                                {location.pathname === item.to && (
                                    <motion.div
                                        layoutId="navTab"
                                        className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${(isScrolled || !isHomePage) ? 'bg-red-600' : 'bg-white'}`}
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Action Right Section */}
                    <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">

                        {/* Search Toggle (Desktop) */}
                        <div className="hidden lg:block w-56 xl:w-72">
                            <SearchBar isCompact={true} className="!max-w-full" />
                        </div>

                        {/* Search Toggle (Mobile) */}
                        <button
                            onClick={() => setIsSearchVisible(!isSearchVisible)}
                            className={`lg:hidden p-2 rounded-xl transition-all ${(isScrolled || !isHomePage) ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-white'
                                }`}
                        >
                            {isSearchVisible ? <FaTimes className="text-xs" /> : <FaSearch className="text-xs" />}
                        </button>

                        {!user ? (
                            <div className="hidden sm:flex items-center gap-1.5">
                                <Link to="/login" className={`px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all ${(isScrolled || !isHomePage) ? 'text-gray-600 hover:text-red-600' : 'text-white hover:text-red-100'
                                    }`}>Login</Link>
                                <Link to="/signup" className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-red-700 transition-all">Sign Up</Link>
                            </div>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <motion.div
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="relative flex items-center gap-2.5 cursor-pointer p-1 pr-3 rounded-full border border-transparent hover:border-gray-100 transition-all select-none"
                                >
                                    <div className="relative">
                                        <img
                                            src={USER.user_img
                                                ? (USER.user_img.startsWith('http')
                                                    ? USER.user_img
                                                    : (() => {
                                                        const cleanPath = USER.user_img.includes('uploads')
                                                            ? '/uploads/' + USER.user_img.split('uploads').pop().replace(/\\/g, '/').replace(/^\//, '')
                                                            : USER.user_img;
                                                        return `${import.meta.env.VITE_URL.replace('/api', '')}${cleanPath}?t=${Date.now()}`;
                                                    })())
                                                : "https://i.pravatar.cc/100?u=foodio"}
                                            alt="profile"
                                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-red-500"
                                        />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                    </div>
                                    <div className="hidden md:block leading-none">
                                        <p className={`text-[9px] font-black uppercase tracking-tighter mb-0.5 ${(isScrolled || !isHomePage) ? 'text-gray-400' : 'text-red-100'}`}>Account</p>
                                        <p className={`text-xs font-black tracking-tight ${(isScrolled || !isHomePage) ? 'text-gray-800' : 'text-white'}`}>{user.user_name.split(' ')[0]}</p>
                                    </div>
                                </motion.div>

                                <AnimatePresence>
                                    {isProfileDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-72 bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-5 z-[60]"
                                        >
                                            <div className="flex items-center gap-4 mb-6 p-1">
                                                <img
                                                    src={user.user_img
                                                        ? (user.user_img.startsWith('http')
                                                            ? user.user_img
                                                            : (() => {
                                                                const cleanPath = user.user_img.includes('uploads')
                                                                    ? '/uploads/' + user.user_img.split('uploads').pop().replace(/\\/g, '/').replace(/^\//, '')
                                                                    : user.user_img;
                                                                return `${import.meta.env.VITE_URL.replace('/api', '')}${cleanPath}?t=${Date.now()}`;
                                                            })())
                                                        : "https://i.pravatar.cc/100?u=foodio"}
                                                    className="w-14 h-14 rounded-2xl object-cover shadow-inner" alt=""
                                                />
                                                <div className="flex-1 truncate">
                                                    <h4 className="font-black text-gray-800 text-base leading-tight truncate">{user.user_name}</h4>
                                                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-red-50 text-red-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-red-100">
                                                        {user.role || user.user_role || 'Member'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <button onClick={navigateToDashboard} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-600 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                                                    <FaTachometerAlt className="text-sm text-red-500" /> My Workspace
                                                </button>
                                                <button onClick={() => { setIsEditModalOpen(true); setIsProfileDropdownOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-600 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                                                    <FaUserCog className="text-sm text-blue-500" /> Account Settings
                                                </button>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all mt-2 border-t border-gray-50 pt-3">
                                                    <FaSignOutAlt className="text-sm" /> Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`lg:hidden p-2.5 rounded-2xl transition-all ${isScrolled ? 'bg-red-600 text-white' : 'bg-white/20 text-white'
                                }`}
                        >
                            {isMenuOpen ? <FaTimes /> : <FaBars />}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Search Overlay */}
                <AnimatePresence>
                    {isSearchVisible && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="lg:hidden bg-white px-4 py-4 border-b border-gray-100"
                        >
                            <SearchBar isCompact={true} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Mobile Sidebar Navigation */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[55] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-[80%] max-w-sm bg-white z-[60] shadow-2xl flex flex-col lg:hidden"
                        >
                            <div className="p-8 flex justify-between items-center bg-gray-50">
                                <h3 className="font-black text-xl uppercase tracking-widest text-gray-800">FOODIO</h3>
                                <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">
                                    <FaTimes />
                                </button>
                            </div>

                            <nav className="flex-1 px-6 py-8 flex flex-col gap-2">
                                {navItems.map((item, i) => (
                                    <motion.div
                                        key={item.to}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            to={item.to}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${location.pathname === item.to ? 'bg-red-600 text-white' : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
                                                }`}
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}

                                {!user && (
                                    <div className="mt-8 grid grid-cols-2 gap-3">
                                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="py-4 bg-gray-100 text-gray-800 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest">Login</Link>
                                        <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="py-4 bg-red-600 text-white rounded-2xl text-center text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-100">Join</Link>
                                    </div>
                                )}
                            </nav>

                            {user && (
                                <div className="p-8 bg-gray-50 flex items-center gap-4">
                                    <img
                                        src={user.user_img
                                            ? (user.user_img.startsWith('http')
                                                ? user.user_img
                                                : (() => {
                                                    const cleanPath = user.user_img.includes('uploads')
                                                        ? '/uploads/' + user.user_img.split('uploads').pop().replace(/\\/g, '/').replace(/^\//, '')
                                                        : user.user_img;
                                                    return `${import.meta.env.VITE_URL.replace('/api', '')}${cleanPath}?t=${Date.now()}`;
                                                })())
                                            : "https://i.pravatar.cc/100?u=foodio"}
                                        className="w-12 h-12 rounded-2xl object-cover"
                                        alt=""
                                    />
                                    <div className="flex-1 truncate">
                                        <p className="font-black text-gray-800 leading-none truncate">{user.user_name}</p>
                                        <button onClick={handleLogout} className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1">Logout</button>
                                    </div>
                                </div>
                            )}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Profile Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-red-50"
                        >
                            <div className="bg-gradient-to-r from-red-600 to-red-500 p-8 text-white relative">
                                <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl hover:bg-white/30 transition-all">&times;</button>
                                <h3 className="text-2xl font-black uppercase tracking-widest mb-1">Update Profile</h3>
                                <p className="text-red-100 text-xs font-bold uppercase opacity-80">Refine your foodio identity</p>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="p-8 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Display Name</label>
                                    <input
                                        value={editForm.user_name}
                                        onChange={e => setEditForm({ ...editForm, user_name: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-red-500 transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Phone Number</label>
                                    <input
                                        value={editForm.user_phone}
                                        onChange={e => setEditForm({ ...editForm, user_phone: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-red-500 transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Physical Address</label>
                                    <textarea
                                        rows="2"
                                        value={editForm.user_address}
                                        onChange={e => setEditForm({ ...editForm, user_address: e.target.value })}
                                        className="w-full px-5 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-red-500 transition-all outline-none resize-none"
                                    ></textarea>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Profile Photo</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-200">
                                            {editForm.user_img ? <img src={URL.createObjectURL(editForm.user_img)} className="w-full h-full object-cover" /> : <FaUser />}
                                        </div>
                                        <input
                                            type="file"
                                            onChange={e => setEditForm({ ...editForm, user_img: e.target.files[0] })}
                                            className="flex-1 text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-6">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all">Discard</button>
                                    <button type="submit" className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-100 hover:bg-red-700 transition-all">Save Changes</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
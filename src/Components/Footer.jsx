import React from 'react';
import logo from "../assets/logo.png";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 w-full pt-16 pb-8 font-sans border-t-[6px] border-red-600">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="bg-white p-2 rounded-2xl group-hover:bg-red-50 transition-colors">
                <img src={logo} alt="Foodio Logo" className="w-12 h-12 object-contain" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight group-hover:text-red-500 transition-colors">FOODIO</h2>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
              Elevating your dining experience with authentic flavors, premium ingredients, and lightning-fast delivery straight to your door.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1">
                <FaFacebookF />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-black text-lg uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-600 rounded-full"></span> Explore
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Restaurants', path: '/restaurant' },
                { name: 'Your Cart', path: '/cart' },
                { name: 'Wishlist', path: '/wishlist' },
                { name: 'Why Choose Us', path: '/choose' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-gray-400 hover:text-red-400 font-medium text-sm flex items-center gap-2 transition-colors group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-red-500 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h3 className="text-white font-black text-lg uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-600 rounded-full"></span> Support
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Contact Us', path: '/contact' },
                { name: 'Login', path: '/login' },
                { name: 'Sign Up', path: '/signup' },
                { name: 'Track Order', path: '/myorders' },
                { name: 'Partner with us', path: '#' }
              ].map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-gray-400 hover:text-red-400 font-medium text-sm flex items-center gap-2 transition-colors group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-red-500 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-black text-lg uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-600 rounded-full"></span> Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 group">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <FaMapMarkerAlt className="text-xs" />
                </div>
                <span className="text-sm font-medium leading-relaxed">123 Culinary Boulevard,<br/>Gourmet District, IN 110001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 group">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <FaPhoneAlt className="text-xs" />
                </div>
                <span className="text-sm font-medium">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 group">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <FaEnvelope className="text-xs" />
                </div>
                <span className="text-sm font-medium">support@foodio.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Foodio. Design & Developed by Shivanshu. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
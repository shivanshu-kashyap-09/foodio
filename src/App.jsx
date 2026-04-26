import React, {useEffect} from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import axios from 'axios';
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Restaurant from "./Pages/Restaurant";
import Cart from "./Pages/Cart";
import WhishList from './Pages/WhishList';
import DishDetail from "./Pages/DishDetail";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import GoogleAuthSuccess from "./Pages/GoogleAuthSuccess";
import Choose from './Components/Choose';
import Contact from './Components/Contact';
import Forget from './Pages/Forget';
import Profile from './Pages/Profile';
import ThaliDesc from './Pages/ThaliDesc';
import RestaurantById from './Pages/RestaurantById';
import OrderTracking from './Pages/OrderTracking';
import MyOrders from './Pages/MyOrders';
import SearchResults from './Pages/SearchResults';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import DeliveryDashboard from './Pages/Delivery/DeliveryDashboard';
import RestaurantDashboard from './Pages/Restaurant/RestaurantDashboard';
import SuperAdminDashboard from './Pages/SuperAdmin/SuperAdminDashboard';
import AIChatbot from './Components/AIChatbot/AIChatbot';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  useEffect(() => {
    // Add a request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="restaurant" element={<Restaurant />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<WhishList />} />
          <Route path='/choose' element={<Choose />} />
          <Route path='/contact'  element={<Contact />} />
          <Route path="dishdetail" element={<DishDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path='/forget-password' element={<Forget />} />
          <Route path="/oauth2-success" element={<GoogleAuthSuccess />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/thali/description/:thali_id' element={<ThaliDesc/>} />
          <Route path='/restaurant/:type/:res_name/:res_id' element={<RestaurantById/>} />
          <Route path='/order/tracking/:orderId' element={<OrderTracking />} />
          <Route path='/orders' element={<MyOrders />} />
          <Route path='/search' element={<SearchResults />} />
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/delivery' element={<DeliveryDashboard />} />
          <Route path='/restaurant/dashboard' element={<RestaurantDashboard />} />
        </Route>
        <Route path='/super-admin' element={<SuperAdminDashboard />} />
      </Routes>
      {/* <AIChatbot /> */}
      <ToastContainer position="top-right" autoClose={3000} />

    </Router>
  );
}

export default App;

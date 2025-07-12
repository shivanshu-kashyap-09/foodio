import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import Restaurant from "./Pages/Restaurant";
import Cart from "./Pages/Cart";
import WhishList from './Pages/WhishList';
import DishDetail from "./Pages/DishDetail";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Choose from './Components/Choose';
import Contact from './Components/Contact';
import Forget from './Pages/Forget';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="restaurant" element={<Restaurant />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<WhishList />} />
          <Route path='/choose' element={<Choose />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="dishdetail" element={<DishDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path='/forget-password' element={<Forget />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;

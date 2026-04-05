import React from 'react'
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Chatbot from "../Components/Chatbot";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Chatbot />
      <Footer />
    </div>
  )
}

export default Layout
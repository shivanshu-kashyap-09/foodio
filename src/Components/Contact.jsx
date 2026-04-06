import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaEnvelopeOpenText } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

const Contact = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [message, setmessage] = useState("");
  const [phone, setphone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
       return toast.error("Please fill in required fields.");
    }
    
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/contact/submit`, {name, email, phone, message});
      if (response.status === 201) {
        toast.success("Message sent successfully! We'll reply soon.");
        setname("");
        setemail("");
        setphone("");
        setmessage("");
      }
    } catch (error) {
      toast.error("Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <motion.div 
      className="relative min-h-screen pt-24 pb-20 bg-gradient-to-br from-red-50/40 via-white to-orange-50/40 font-sans overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-orange-200/30 to-red-300/30 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-100/40 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header Text */}
        <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto mb-16">
           <span className="text-red-500 font-extrabold text-[10px] uppercase tracking-[0.25em] mb-2 block">Tell Us Everything</span>
           <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
             We'd love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 italic">hear from you</span>
           </h2>
           <p className="text-gray-500 font-medium">Whether you have a question about our dishes, pricing, or anything else, our team is ready to answer all your questions.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start justify-center">
          
          {/* Left: Info Panel */}
          <motion.div variants={itemVariants} className="w-full lg:w-[40%] space-y-8">
             
             {/* Contact Card */}
             <div className="bg-white rounded-[2rem] p-8 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 relative group overflow-hidden">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                  <FaEnvelopeOpenText className="text-2xl" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">Support & Feedback</h3>
               <p className="text-gray-500 font-medium text-sm mb-4">Reach out direct via email.</p>
               <a href="mailto:support@foodio.com" className="text-lg font-black text-red-600 hover:text-red-700 transition-colors">support@foodio.com</a>
             </div>

             {/* Directions Card */}
             <div className="bg-white rounded-[2rem] p-8 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 relative group overflow-hidden">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <FaMapMarkerAlt className="text-2xl" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Our Headquarters</h3>
               <p className="text-gray-500 font-medium text-sm mb-6 leading-relaxed">
                  123 Culinary Boulevard,<br/>Gourmet District, IN 110001
               </p>
               <a href="https://www.google.com/maps" target="_blank" rel="noreferrer" className="inline-block text-xs font-bold uppercase tracking-widest bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-md">
                 Get Directions
               </a>
             </div>

             {/* Social Area */}
             <div className="flex items-center gap-4 pl-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mr-2">Follow Us:</span>
                {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm transform hover:-translate-y-1">
                    <Icon className="text-sm" />
                  </a>
                ))}
             </div>
          </motion.div>

          {/* Right: Form Panel */}
          <motion.div variants={itemVariants} className="w-full lg:w-[60%]">
             <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Name *</label>
                       <input
                         type="text"
                         required
                         value={name}
                         onChange={(e) => setname(e.target.value)}
                         className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm font-medium px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 focus:bg-white transition-all placeholder-gray-400"
                         placeholder="John Doe"
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Email *</label>
                       <input
                         type="email"
                         required
                         value={email}
                         onChange={(e) => setemail(e.target.value)}
                         className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm font-medium px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 focus:bg-white transition-all placeholder-gray-400"
                         placeholder="john@example.com"
                       />
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Phone Number (Optional)</label>
                     <input
                       type="tel"
                       value={phone}
                       onChange={(e) => setphone(e.target.value)}
                       className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm font-medium px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 focus:bg-white transition-all placeholder-gray-400"
                       placeholder="+91 98765 43210"
                     />
                   </div>

                   <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Message *</label>
                     <textarea
                       required
                       rows="4"
                       value={message}
                       onChange={(e) => setmessage(e.target.value)}
                       className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm font-medium px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 focus:bg-white transition-all placeholder-gray-400 resize-none"
                       placeholder="How can we help you today?"
                     ></textarea>
                   </div>

                   <button
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold px-8 py-5 rounded-2xl shadow-lg shadow-red-200/50 transform transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70"
                   >
                     {isSubmitting ? 'Sending Message...' : 'Send Message'}
                   </button>

                   <p className="text-center text-xs text-gray-400 font-medium pt-2">
                      By submitting this form, you agree to our <a href="#" className="font-bold text-red-500 hover:underline">Privacy Policy</a>
                   </p>
                </form>
             </div>
             
             {/* Decorative element drifting in corner */}
             <motion.img
               src="https://www.swiggy.com/corporate/wp-content/uploads/2024/10/Sandwich-1-796x1024.webp"
               alt="Decorative Food"
               className="absolute -bottom-16 -right-16 w-48 h-48 lg:w-64 lg:h-64 object-contain opacity-80 -z-10 blur-[2px]"
               animate={{ rotate: 10, y: [0, -15, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
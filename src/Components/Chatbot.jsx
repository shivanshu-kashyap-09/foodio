import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaRobot, FaPaperPlane, FaTimes, FaMinus, FaRegSmile } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { type: 'bot', text: "Namaste! I'm Foodio AI. I can recommend the best dishes for your mood. What are you craving today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(localStorage.getItem('chat_conv_id') || '');
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = { type: 'user', text: message };
        setChatHistory(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/chatbot/message`, {
                message: message,
                conversationId: conversationId
            });

            if (res.data.success) {
                const botMessage = { type: 'bot', text: res.data.data.response };
                setChatHistory(prev => [...prev, botMessage]);
                if (!conversationId) {
                    setConversationId(res.data.data.conversationId);
                    localStorage.setItem('chat_conv_id', res.data.data.conversationId);
                }
            }
        } catch (err) {
            console.error('Chatbot error:', err);
            toast.error("AI Assistant is having a snack break. Try again later!");
            setChatHistory(prev => [...prev, { type: 'bot', text: "I'm sorry, I'm experiencing some connectivity issues. Please try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100 }}
                        className="bg-white/95 backdrop-blur-xl border border-red-100 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(220,38,38,0.3)] w-[90vw] sm:w-[400px] h-[600px] flex flex-col overflow-hidden mb-6"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 flex items-center justify-between text-white shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 p-3 rounded-2xl">
                                    <FaRobot className="text-2xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Foodio AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] uppercase font-black tracking-widest opacity-80">Cooking Response...</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                    <FaMinus />
                                </button>
                                <button onClick={() => { setIsOpen(false); setChatHistory([{ type: 'bot', text: "Namaste! I'm Foodio AI. I can recommend the best dishes for your mood. What are you craving today?" }]); setConversationId(''); localStorage.removeItem('chat_conv_id'); }} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gradient-to-b from-red-50/50 to-white">
                            {chatHistory.map((chat, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: chat.type === 'bot' ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={idx}
                                    className={`flex ${chat.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-[1.5rem] shadow-sm text-sm font-medium leading-relaxed ${
                                        chat.type === 'bot' 
                                        ? 'bg-white border border-red-50 text-gray-800 rounded-tl-none' 
                                        : 'bg-red-600 text-white rounded-tr-none shadow-red-200 shadow-md'
                                    }`}>
                                        {chat.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-white border border-red-50 p-4 rounded-[1.5rem] rounded-tl-none flex gap-1.5">
                                        <span className="w-2 h-2 bg-red-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-2 h-2 bg-red-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-2 h-2 bg-red-400 rounded-full animate-bounce" />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-red-50">
                            <div className="flex items-center gap-3 bg-red-50/50 p-2 rounded-[2rem] border border-red-100 transition-all focus-within:border-red-300 focus-within:bg-white focus-within:shadow-md">
                                <button type="button" className="p-3 text-red-400 hover:text-red-500 transition-colors">
                                    <FaRegSmile className="text-xl" />
                                </button>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your craving..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 placeholder-red-300"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!message.trim() || isLoading}
                                    className="bg-red-600 text-white p-3.5 rounded-full hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 disabled:opacity-50"
                                >
                                    <FaPaperPlane className="text-sm" />
                                </button>
                            </div>
                            <p className="text-[9px] text-center mt-3 text-red-300 font-bold uppercase tracking-widest opacity-60">Powered by Groq AI Intelligence</p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Float Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="bg-red-600 text-white p-5 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(220,38,38,0.5)] flex items-center justify-center group relative overflow-hidden"
                >
                    <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <FaRobot className="text-3xl" />
                    </motion.div>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full" />
                </motion.button>
            )}
        </div>
    );
};

export default Chatbot;

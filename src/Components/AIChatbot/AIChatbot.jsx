import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: 'Hello! I am your Foodio AI assistant. How can I help you today?', sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages([...messages, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('/api/ai/chatbot', { query: input });
            if (response.data.success) {
                setMessages(prev => [...prev, { text: response.data.data.response, sender: 'ai' }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { text: "I'm having trouble thinking right now. Please try again later!", sender: 'ai' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-12 right-12 z-50 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="bg-white/80 backdrop-blur-xl w-80 md:w-96 rounded-[32px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden flex flex-col mb-6"
                    >
                        <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 flex justify-between items-center text-white shadow-lg shadow-red-100">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <span className="flex h-3 w-3 absolute -top-1 -right-1">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                                    </span>
                                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">✨</div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm tracking-tight">Foodio AI <span className="opacity-60 font-medium">Assistant</span></h4>
                                    <p className="text-[10px] opacity-80 uppercase font-extrabold tracking-widest">Powered by Groq</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform p-1 opacity-60 hover:opacity-100">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>

                        <div className="h-96 overflow-y-auto p-6 flex flex-col gap-4 scroll-smooth">
                            {messages.map((m, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    key={i} 
                                    className={`flex ${m.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[85%] px-5 py-3.5 rounded-3xl text-sm font-medium leading-relaxed
                                        ${m.sender === 'ai' 
                                            ? 'bg-gray-50 text-gray-800 rounded-bl-none shadow-sm' 
                                            : 'bg-gradient-to-br from-red-500 to-rose-500 text-white rounded-br-none shadow-md shadow-red-50'}`}>
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-50 px-5 py-3.5 rounded-3xl rounded-bl-none text-xs font-bold text-gray-400 animate-pulse">
                                        ✨ AI is thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-5 bg-gray-50/50 flex items-center gap-3 border-t border-gray-100">
                            <input 
                                type="text" 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Craving something specific?"
                                className="flex-1 bg-white px-5 py-3.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 placeholder:text-gray-400 shadow-inner"
                            />
                            <button 
                                onClick={handleSend} 
                                disabled={loading}
                                className="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-100 active:scale-90"
                            >
                                <svg className="w-5 h-5 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-[24px] shadow-2xl flex items-center justify-center text-2xl transition-all duration-300
                    ${isOpen ? 'bg-gray-800 text-white' : 'bg-red-500 text-white shadow-red-200 hover:shadow-red-300'}`}
            >
                {isOpen ? '×' : '✨'}
            </motion.button>
        </div>
    );
};

export default AIChatbot;

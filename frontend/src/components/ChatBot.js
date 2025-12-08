import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Only send recent history (last 10 messages) to keep context manageable
            const recentHistory = newMessages.slice(-10);
            
            const res = await axios.post('http://localhost:8000/chat', {
                message: userMessage,
                history: recentHistory.slice(0, -1) // Exclude the message we just added
            });
            
            setMessages([...newMessages, { role: 'assistant', content: res.data.reply }]);
        } catch (err) {
            console.error(err);
            setMessages([...newMessages, { 
                role: 'assistant', 
                content: 'Sorry, I encountered an error. Please make sure the backend is running and your OpenAI API key is configured.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition-all hover:scale-110 z-50"
                    aria-label="Open chat"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                        />
                    </svg>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
                    {/* Header */}
                    <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-6 w-6" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                                />
                            </svg>
                            <div>
                                <h3 className="font-semibold">AI Assistant</h3>
                                <p className="text-xs text-indigo-100">Ask me about investing</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {messages.length > 0 && (
                                <button
                                    onClick={clearChat}
                                    className="hover:bg-indigo-700 p-1 rounded transition-colors"
                                    title="Clear chat"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-5 w-5" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                        />
                                    </svg>
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-indigo-700 p-1 rounded transition-colors"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M19 9l-7 7-7-7" 
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-16 w-16 text-indigo-300 mb-4" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={1.5} 
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                                    />
                                </svg>
                                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                    Welcome to InvestMate AI!
                                </h4>
                                <p className="text-sm text-gray-500 mb-4">
                                    I'm here to help you learn about investing. Ask me anything!
                                </p>
                                <div className="text-left space-y-2 text-sm text-gray-600">
                                    <p className="italic">💡 Try asking:</p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>"What is diversification?"</li>
                                        <li>"How do I start investing?"</li>
                                        <li>"What's the difference between stocks and bonds?"</li>
                                        <li>"Tell me about risk tolerance"</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, i) => (
                                    <div 
                                        key={i} 
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div 
                                            className={`max-w-[80%] p-3 rounded-lg ${
                                                msg.role === 'user' 
                                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-200'
                                            }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white text-gray-800 p-3 rounded-lg rounded-bl-none shadow-sm border border-gray-200">
                                            <div className="flex space-x-2">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about investing..."
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                            <button 
                                onClick={sendMessage}
                                disabled={isLoading || !input.trim()}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-5 w-5" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                                    />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            Press Enter to send
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatBot;


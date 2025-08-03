import React, { useState } from 'react';
import axios from 'axios';

function Assistant() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');

        try {
        const res = await axios.post('http://localhost:8000/chat', { message: input });
        setMessages([...newMessages, { role: 'assistant', content: res.data.reply }]);
        } catch (err) {
        console.error(err);
        }
    };
    return (
        <div className="p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
        <div className="space-y-4 mb-4">
            {messages.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {msg.content}
                </div>
            </div>
            ))}
        </div>
        <div className="flex">
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border p-2 mr-2 rounded"
            placeholder="Ask about investing..."
            />
            <button onClick={sendMessage} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Send
            </button>
        </div>
        </div>
    );
}

export default Assistant;

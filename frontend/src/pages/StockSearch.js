import React, { useState } from 'react';
import axios from 'axios';

function StockSearch() {
    const [symbol, setSymbol] = useState('');
    const [stock, setStock] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchStock = async () => {
        if (!symbol.trim()) {
            setError('Please enter a stock symbol');
            return;
        }

        setLoading(true);
        setError('');
        setStock(null);

        try {
            const res = await axios.get(`http://localhost:8000/stock/${symbol.toUpperCase()}`);
            setStock(res.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 404) {
                setError('Stock not found. Please check the symbol and try again.');
            } else {
                setError('Failed to fetch stock data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchStock();
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Stock Search</h2>
            
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter stock symbol (e.g., AAPL, MSFT, GOOGL)"
                    className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                />
                <button 
                    onClick={fetchStock} 
                    disabled={loading}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {stock && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">{stock.name}</h3>
                        <span className="text-lg font-semibold text-gray-600">({stock.symbol})</span>
                    </div>
                    
                    <div className="mb-4">
                        <span className="text-3xl font-bold text-green-600">
                            ${stock.price?.toFixed(2) || 'N/A'}
                        </span>
                    </div>
                    
                    {stock.summary && (
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">Company Summary</h4>
                            <p className="text-gray-600 leading-relaxed">{stock.summary}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default StockSearch;

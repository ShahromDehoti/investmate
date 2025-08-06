import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';

function StockChart({ symbol, isVisible, onClose }) {
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isVisible && symbol) {
            fetchStockDetails();
        }
    }, [isVisible, symbol]);

    const fetchStockDetails = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.get(`http://localhost:8000/stock/${symbol}/details`);
            setStockData(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch stock details');
        } finally {
            setLoading(false);
        }
    };

    const formatMarketCap = (marketCap) => {
        if (!marketCap) return 'N/A';
        if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
        if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
        if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
        return `$${marketCap.toLocaleString()}`;
    };

    const formatNumber = (num) => {
        if (num === null || num === undefined) return 'N/A';
        return num.toLocaleString();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {stockData?.name} ({symbol})
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading stock details...</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    {stockData && (
                        <div>
                            {/* Current Price */}
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-green-600">
                                    ${stockData.current_price?.toFixed(2)}
                                </span>
                            </div>

                            {/* Performance Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Market Cap</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {formatMarketCap(stockData.performance_metrics.market_cap)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">P/E Ratio</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {formatNumber(stockData.performance_metrics.pe_ratio)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">1 Year Return</h3>
                                    <p className={`text-lg font-semibold ${
                                        stockData.performance_metrics.one_year_return >= 0 
                                            ? 'text-green-600' 
                                            : 'text-red-600'
                                    }`}>
                                        {stockData.performance_metrics.one_year_return}%
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Beta</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {formatNumber(stockData.performance_metrics.beta)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">Dividend Yield</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {stockData.performance_metrics.dividend_yield 
                                            ? `${(stockData.performance_metrics.dividend_yield * 100).toFixed(2)}%`
                                            : 'N/A'
                                        }
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">P/B Ratio</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {formatNumber(stockData.performance_metrics.price_to_book)}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">52W High</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        ${stockData.performance_metrics.fifty_two_week_high?.toFixed(2) || 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-gray-500">52W Low</h3>
                                    <p className="text-lg font-semibold text-gray-900">
                                        ${stockData.performance_metrics.fifty_two_week_low?.toFixed(2) || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Price Chart */}
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">1 Year Price History</h3>
                                <div className="h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stockData.chart_data}>
                                            <defs>
                                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis 
                                                dataKey="date" 
                                                stroke="#6B7280"
                                                fontSize={12}
                                                tickFormatter={(value) => {
                                                    const date = new Date(value);
                                                    return date.toLocaleDateString('en-US', { 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    });
                                                }}
                                            />
                                            <YAxis 
                                                stroke="#6B7280"
                                                fontSize={12}
                                                tickFormatter={(value) => `$${value}`}
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: '#FFFFFF',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                                labelFormatter={(value) => {
                                                    const date = new Date(value);
                                                    return date.toLocaleDateString('en-US', { 
                                                        weekday: 'long',
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    });
                                                }}
                                                formatter={(value) => [`$${value}`, 'Price']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="price"
                                                stroke="#10B981"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorPrice)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Volume Chart */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Trading Volume</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={stockData.chart_data}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis 
                                                dataKey="date" 
                                                stroke="#6B7280"
                                                fontSize={12}
                                                tickFormatter={(value) => {
                                                    const date = new Date(value);
                                                    return date.toLocaleDateString('en-US', { 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    });
                                                }}
                                            />
                                            <YAxis 
                                                stroke="#6B7280"
                                                fontSize={12}
                                                tickFormatter={(value) => {
                                                    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
                                                    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
                                                    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
                                                    return value.toLocaleString();
                                                }}
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: '#FFFFFF',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                                labelFormatter={(value) => {
                                                    const date = new Date(value);
                                                    return date.toLocaleDateString('en-US', { 
                                                        weekday: 'long',
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    });
                                                }}
                                                formatter={(value) => [value.toLocaleString(), 'Volume']}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="volume"
                                                stroke="#6366F1"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StockChart; 
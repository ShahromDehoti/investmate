import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StockChart from '../components/StockChart';

function Portfolio() {
    const [portfolio, setPortfolio] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [selectedStock, setSelectedStock] = useState(null);
    const [showChart, setShowChart] = useState(false);

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            setLoading(true);
            const [portfolioRes, summaryRes] = await Promise.all([
                axios.get('http://localhost:8000/portfolio'),
                axios.get('http://localhost:8000/portfolio/summary')
            ]);
            setPortfolio(portfolioRes.data);
            setSummary(summaryRes.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch portfolio data');
        } finally {
            setLoading(false);
        }
    };

    const updatePortfolioItem = async (itemId, updates) => {
        try {
            await axios.put(`http://localhost:8000/portfolio/${itemId}`, updates);
            setEditingItem(null);
            fetchPortfolio(); // Refresh data
        } catch (err) {
            console.error(err);
            setError('Failed to update portfolio item');
        }
    };

    const removeFromPortfolio = async (itemId) => {
        if (!window.confirm('Are you sure you want to remove this stock from your portfolio?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/portfolio/${itemId}`);
            fetchPortfolio(); // Refresh data
        } catch (err) {
            console.error(err);
            setError('Failed to remove stock from portfolio');
        }
    };

    const handleEdit = (item) => {
        setEditingItem({
            id: item.id,
            shares: item.shares,
            avg_price: item.avg_price
        });
    };

    const handleSave = () => {
        if (editingItem) {
            updatePortfolioItem(editingItem.id, {
                shares: editingItem.shares,
                avg_price: editingItem.avg_price
            });
        }
    };

    const handleCancel = () => {
        setEditingItem(null);
    };

    const toggleExpanded = (itemId) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
        } else {
            newExpanded.add(itemId);
        }
        setExpandedItems(newExpanded);
    };

    const openChart = (symbol) => {
        setSelectedStock(symbol);
        setShowChart(true);
    };

    const closeChart = () => {
        setShowChart(false);
        setSelectedStock(null);
    };

    if (loading) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading portfolio...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">My Portfolio</h2>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {summary && (
                <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
                        <p className="text-2xl font-bold text-gray-900">${summary.total_value?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Total Cost</h3>
                        <p className="text-2xl font-bold text-gray-900">${summary.total_cost?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Total Gain/Loss</h3>
                        <p className={`text-2xl font-bold ${summary.total_gain_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${summary.total_gain_loss?.toFixed(2) || '0.00'}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Gain/Loss %</h3>
                        <p className={`text-2xl font-bold ${summary.total_gain_loss_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {summary.total_gain_loss_percent?.toFixed(2) || '0.00'}%
                        </p>
                    </div>
                </div>
            )}

            {portfolio.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Your portfolio is empty.</p>
                    <p className="text-gray-400 mt-2">Search for stocks and add them to your portfolio to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {portfolio.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            {/* Main Card */}
                            <div 
                                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => toggleExpanded(item.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.symbol}</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500">Shares</p>
                                                <p className="font-semibold">{item.shares}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Avg Price</p>
                                                <p className="font-semibold">${item.avg_price?.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Total Value</p>
                                                <p className="font-semibold">${item.total_value?.toFixed(2) || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Total Cost</p>
                                                <p className="font-semibold">${item.total_cost?.toFixed(2) || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="ml-6 flex flex-col items-end space-y-3">
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-600">
                                                ${item.current_price?.toFixed(2) || 'N/A'}
                                            </p>
                                            <p className={`text-sm font-medium ${item.gain_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                ${item.gain_loss?.toFixed(2) || 'N/A'} ({item.gain_loss_percent?.toFixed(2) || 'N/A'}%)
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(item);
                                                }}
                                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFromPortfolio(item.id);
                                                }}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedItems.has(item.id) && (
                                <div className="border-t border-gray-200 p-6 bg-gray-50">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Portfolio Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Shares Owned:</span>
                                                    <span className="font-medium">{item.shares}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Average Price:</span>
                                                    <span className="font-medium">${item.avg_price?.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Total Invested:</span>
                                                    <span className="font-medium">${item.total_cost?.toFixed(2) || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Current Value:</span>
                                                    <span className="font-medium">${item.total_value?.toFixed(2) || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Performance</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Gain/Loss:</span>
                                                    <span className={`font-medium ${item.gain_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        ${item.gain_loss?.toFixed(2) || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Gain/Loss %:</span>
                                                    <span className={`font-medium ${item.gain_loss_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {item.gain_loss_percent?.toFixed(2) || 'N/A'}%
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Current Price:</span>
                                                    <span className="font-medium">${item.current_price?.toFixed(2) || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-2">Quick Actions</h4>
                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => openChart(item.symbol)}
                                                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                                >
                                                    View Detailed Chart
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                                >
                                                    Edit Holdings
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Edit Mode */}
                            {editingItem?.id === item.id && (
                                <div className="border-t border-gray-200 p-6 bg-yellow-50">
                                    <h4 className="font-semibold text-gray-800 mb-4">Edit Holdings</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Number of Shares
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editingItem.shares}
                                                onChange={(e) => setEditingItem({...editingItem, shares: parseFloat(e.target.value)})}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Average Price per Share
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={editingItem.avg_price}
                                                onChange={(e) => setEditingItem({...editingItem, avg_price: parseFloat(e.target.value)})}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 mt-4">
                                        <button
                                            onClick={handleSave}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Stock Chart Modal */}
            {showChart && selectedStock && (
                <StockChart
                    symbol={selectedStock}
                    isVisible={showChart}
                    onClose={closeChart}
                />
            )}
        </div>
    );
}

export default Portfolio;

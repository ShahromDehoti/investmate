import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Portfolio() {
    const [portfolio, setPortfolio] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingItem, setEditingItem] = useState(null);

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
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {portfolio.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                <div className="text-sm text-gray-500">{item.symbol}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingItem?.id === item.id ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editingItem.shares}
                                                    onChange={(e) => setEditingItem({...editingItem, shares: parseFloat(e.target.value)})}
                                                    className="w-20 border border-gray-300 rounded px-2 py-1"
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-900">{item.shares}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingItem?.id === item.id ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editingItem.avg_price}
                                                    onChange={(e) => setEditingItem({...editingItem, avg_price: parseFloat(e.target.value)})}
                                                    className="w-20 border border-gray-300 rounded px-2 py-1"
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-900">${item.avg_price?.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">${item.current_price?.toFixed(2) || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">${item.total_value?.toFixed(2) || 'N/A'}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <span className={`text-sm font-medium ${item.gain_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    ${item.gain_loss?.toFixed(2) || 'N/A'}
                                                </span>
                                                <div className={`text-xs ${item.gain_loss_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {item.gain_loss_percent?.toFixed(2) || 'N/A'}%
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {editingItem?.id === item.id ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={handleSave}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromPortfolio(item.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Portfolio;

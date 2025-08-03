import React, { useState } from 'react';
import axios from 'axios';

function StockSearch() {
    const [symbol, setSymbol] = useState('');
    const [stock, setStock] = useState(null);

    const fetchStock = async () => {
        try {
        const res = await axios.get(`http://localhost:8000/stock/${symbol}`);
        setStock(res.data);
        } catch (err) {
        console.error(err);
        }
    };
    return (
        <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Search Stock</h2>
        <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter stock symbol"
            className="border p-2 mr-2"
        />
        <button onClick={fetchStock} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Search
        </button>

        {stock && (
            <div className="mt-6 p-4 border rounded bg-white">
            <h3 className="text-xl font-semibold">{stock.name} ({stock.symbol})</h3>
            <p className="text-gray-600">Price: ${stock.price}</p>
            <p className="mt-2 text-sm text-gray-500">{stock.summary}</p>
            </div>
        )}
        </div>
    );
}

export default StockSearch;

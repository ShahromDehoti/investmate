import React, { useState } from 'react';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import StockSearch from './pages/StockSearch';
import Assistant from './pages/Assistant';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'portfolio':
        return <Portfolio />;
      case 'search':
        return <StockSearch />;
      case 'assistant':
        return <Assistant />;
      default:
        return <Home />;
    }
  };

  const isActivePage = (page) => {
    return currentPage === page ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-indigo-600';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold text-indigo-600">InvestMate</h1>
        <div className="space-x-4">
          <button 
            onClick={() => setCurrentPage('home')}
            className={isActivePage('home')}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentPage('portfolio')}
            className={isActivePage('portfolio')}
          >
            Portfolio
          </button>
          <button 
            onClick={() => setCurrentPage('search')}
            className={isActivePage('search')}
          >
            Search
          </button>
          <button 
            onClick={() => setCurrentPage('assistant')}
            className={isActivePage('assistant')}
          >
            AI Assistant
          </button>
        </div>
      </nav>
      {renderPage()}
    </div>
  );
}



export default App;
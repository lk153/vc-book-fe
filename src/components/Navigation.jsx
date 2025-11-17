import React from 'react';
import { ShoppingCart, BookOpen, Home } from 'lucide-react';

export default function Navigation({ cart, setCurrentPage, showBackButton = false }) {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {showBackButton ? (
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <BookOpen size={32} />
            <span>BookStore</span>
          </div>
        )}
        <button
          onClick={() => setCurrentPage('checkout')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <ShoppingCart size={20} />
          <span>Cart ({cart.length})</span>
        </button>
      </div>
    </nav>
  );
}
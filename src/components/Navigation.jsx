// components/Navigation.jsx
import React, { useState } from 'react';
import { ShoppingCart, BookOpen, Home, User, LogOut, LogIn } from 'lucide-react';

export default function Navigation({ cart, setCurrentPage, showBackButton = false, user, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

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
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition"
          >
            <BookOpen size={32} />
            <span>BookStore</span>
          </button>
        )}

        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <button 
            onClick={() => setCurrentPage('checkout')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <ShoppingCart size={20} />
            <span>Cart ({cart.length})</span>
          </button>

          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
              >
                <User size={20} className="text-gray-600" />
                <span className="text-gray-700 font-medium">{user.name || user.fullName || 'User'}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-800">{user.name || user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      alert('Profile page coming soon!');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      alert('Orders page coming soon!');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    My Orders
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setCurrentPage('login')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
            >
              <LogIn size={20} />
              <span className="font-medium">Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </nav>
  );
}
// src/components/Navigation.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, BookOpen, Home, User, LogOut, LogIn, Settings, Package, ChevronDown } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../i18n/LanguageContext';

export default function Navigation({ cart, showBackButton = false, user, onLogout }) {
  const { t } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = user?.name || user?.fullName || user?.email || 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {showBackButton ? (
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Home size={20} />
            <span>{t('nav.backToHome')}</span>
          </button>
        ) : (
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition"
          >
            <BookOpen size={32} />
            <span>{t('nav.title')}</span>
          </Link>
        )}

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Cart Button */}
          <button
            onClick={() => navigate('/checkout')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Cart</span>
            <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-sm font-bold">
              {cart.length}
            </span>
          </button>

          {/* User Profile Menu */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {getUserInitials()}
                </div>
                <span className="hidden md:inline text-gray-700 font-medium">
                  {user.name || user.fullName || 'User'}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-slideDown">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {getUserInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {user.name || user.fullName || 'User'}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {user.email || 'No email'}
                        </p>
                        {user.phone && (
                          <p className="text-xs text-gray-500 truncate">
                            {user.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    {/* Profile */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/profile');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition flex items-center gap-3 group"
                    >
                      <User size={18} className="text-gray-500 group-hover:text-blue-600" />
                      <div>
                        <p className="font-medium group-hover:text-blue-600">{t('nav.profile')}</p>
                        <p className="text-xs text-gray-500">{t('nav.view_edit_profile')}</p>
                      </div>
                    </button>

                    {/* Orders */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/orders');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition flex items-center gap-3 group"
                    >
                      <Package size={18} className="text-gray-500 group-hover:text-blue-600" />
                      <div>
                        <p className="font-medium group-hover:text-blue-600">{t('nav.orders')}</p>
                        <p className="text-xs text-gray-500">{t('nav.track_orders')}</p>
                      </div>
                    </button>

                    {/* Settings */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/settings');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition flex items-center gap-3 group"
                    >
                      <Settings size={18} className="text-gray-500 group-hover:text-blue-600" />
                      <div>
                        <p className="font-medium group-hover:text-blue-600">{t('nav.settings')}</p>
                        <p className="text-xs text-gray-500">{t('nav.account_preferences')}</p>
                      </div>
                    </button>
                  </div>

                  {/* Divider */}
                  <hr className="my-2 border-gray-200" />

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (window.confirm('Are you sure you want to logout?')) {
                        onLogout();
                      }
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-3 group"
                  >
                    <LogOut size={18} className="text-red-500" />
                    <div>
                      <p className="font-medium">{t('nav.logout')}</p>
                      <p className="text-xs text-red-400">{t('nav.logout_confirmation')}</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition font-medium"
            >
              <LogIn size={20} />
              <span>{t('nav.login')}</span>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}
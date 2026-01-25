import { useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, BookOpen, Home, User, LogOut, LogIn, Settings, Package, ChevronDown } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useClickOutside } from '../hooks/useClickOutside';
import { ROUTES } from '../constants/routes';

export function Navigation({ showBackButton = false }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleCloseMenu = useCallback(() => setShowUserMenu(false), []);
  useClickOutside(menuRef, handleCloseMenu, showUserMenu);

  const getUserInitials = () => {
    const name = user?.name || user?.fullName || user?.email || 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    if (window.confirm(t('nav.logoutConfirm'))) {
      logout();
      navigate(ROUTES.HOME);
    }
  };

  return (
    <nav className="bg-ivory-100 shadow-md sticky top-0 z-50 border-b-2 border-gold-500/30">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {showBackButton ? (
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium"
          >
            <Home size={20} />
            <span>{t('nav.backToHome')}</span>
          </button>
        ) : (
          <Link to={ROUTES.HOME} className="flex items-center gap-2 text-2xl font-bold text-gold-600 text-gold-glow cursor-pointer hover:text-gold-700 transition font-serif">
            <BookOpen size={32} />
            <span>{t('nav.title')}</span>
          </Link>
        )}

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          {/* Cart Button */}
          <button
            onClick={() => navigate(ROUTES.CHECKOUT)}
            className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-4 py-2 rounded-lg hover:from-gold-600 hover:to-gold-700 transition shadow-gold-soft"
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">{t('nav.cart')}</span>
            <span className="bg-white text-gold-600 px-2 py-0.5 rounded-full text-sm font-bold">
              {cart.length}
            </span>
          </button>

          {/* User Profile Menu */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gold-300 hover:border-gold-500 hover:bg-gold-50 transition"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-white font-bold text-sm">
                  {getUserInitials()}
                </div>
                <span className="hidden md:inline text-brown-700 font-medium">
                  {user.name || user.fullName || 'User'}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gold-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-ivory-50 rounded-xl shadow-2xl border border-gold-300/50 py-2 z-50 animate-slideDown">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gold-200 bg-gradient-to-r from-gold-50 to-ivory-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-white font-bold text-lg">
                        {getUserInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-brown-800 truncate">
                          {user.name || user.fullName || 'User'}
                        </p>
                        <p className="text-xs text-brown-600 truncate">
                          {user.email || 'No email'}
                        </p>
                        {user.phone && (
                          <p className="text-xs text-brown-500 truncate">
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
                        navigate(ROUTES.PROFILE);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-brown-700 hover:bg-gold-50 transition flex items-center gap-3 group"
                    >
                      <User size={18} className="text-brown-500 group-hover:text-gold-600" />
                      <div>
                        <p className="font-medium group-hover:text-gold-600">{t('nav.profile')}</p>
                        <p className="text-xs text-brown-500">{t('nav.view_edit_profile')}</p>
                      </div>
                    </button>

                    {/* Orders */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate(ROUTES.ORDERS);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-brown-700 hover:bg-gold-50 transition flex items-center gap-3 group"
                    >
                      <Package size={18} className="text-brown-500 group-hover:text-gold-600" />
                      <div>
                        <p className="font-medium group-hover:text-gold-600">{t('nav.orders')}</p>
                        <p className="text-xs text-brown-500">{t('nav.track_orders')}</p>
                      </div>
                    </button>

                    {/* Settings */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate(ROUTES.SETTINGS);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-brown-700 hover:bg-gold-50 transition flex items-center gap-3 group"
                    >
                      <Settings size={18} className="text-brown-500 group-hover:text-gold-600" />
                      <div>
                        <p className="font-medium group-hover:text-gold-600">{t('nav.settings')}</p>
                        <p className="text-xs text-brown-500">{t('nav.account_preferences')}</p>
                      </div>
                    </button>
                  </div>

                  {/* Divider */}
                  <hr className="my-2 border-gold-200" />

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-crimson-400 hover:bg-crimson-50 transition flex items-center gap-3 group"
                  >
                    <LogOut size={18} className="text-crimson-400" />
                    <div>
                      <p className="font-medium">{t('nav.logout')}</p>
                      <p className="text-xs text-crimson-300">{t('nav.logout_confirmation')}</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white transition font-medium"
            >
              <LogIn size={20} />
              <span>{t('nav.login')}</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
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

export default Navigation;

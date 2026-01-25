import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Home, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatPrice } from '../../utils/price';
import { useCart } from '../../context/CartContext';
import { CartItem } from './CartItem';

export function CartPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cart, isGuest, updateCartQuantity, getTotalPrice } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-100 via-ivory-50 to-ivory-200 bg-chinese-pattern">
      <nav className="bg-ivory-100 shadow-md border-b-2 border-gold-300/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium"
          >
            <Home size={20} />
            <span>{t('cart.continueShopping')}</span>
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gold-600 text-gold-glow mb-8 font-serif">{t('cart.title')}</h1>

        {/* Guest Warning */}
        {isGuest && cart.length > 0 && (
          <div className="bg-gold-50 border border-gold-300 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="text-gold-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <p className="text-brown-800 font-medium mb-1">{t('cart.guestWarning')}</p>
              <p className="text-brown-700 text-sm">
                {t('cart.guestMessage')}
                <Link to="/login" className="font-medium underline ml-1 text-gold-600">
                  {t('nav.login')}
                </Link> {t('cart.loginSync')}
              </p>
            </div>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="bg-ivory-100 rounded-xl shadow-lg p-12 text-center border border-gold-200/50">
            <ShoppingCart size={64} className="mx-auto text-gold-300 mb-4" />
            <h2 className="text-2xl font-semibold text-brown-700 mb-2 font-serif">{t('cart.empty')}</h2>
            <p className="text-brown-500 mb-6">{t('cart.emptyMessage')}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-3 rounded-lg hover:from-gold-600 hover:to-gold-700 transition shadow-gold-soft"
            >
              {t('cart.browseBooks')}
            </button>
          </div>
        ) : (
          <div className="bg-ivory-100 rounded-xl shadow-lg overflow-hidden border border-gold-200/50">
            <div className="divide-y divide-gold-200">
              {cart.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  updateCartQuantity={updateCartQuantity}
                />
              ))}
            </div>

            <div className="bg-ivory-200 p-6 border-t-2 border-gold-200">
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-brown-800 font-serif">{t('common.total')}</span>
                <span className="text-3xl font-bold text-crimson-400 font-serif">{formatPrice(getTotalPrice())}{t('common.currencySymbol')}</span>
              </div>

              {isGuest ? (
                <Link
                  to="/login"
                  className="block w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-4 rounded-lg font-bold text-lg hover:from-gold-600 hover:to-gold-700 transition text-center shadow-gold-soft"
                >
                  {t('cart.loginToCheckout')}
                </Link>
              ) : (
                <button
                  onClick={() => navigate('/shipping-address')}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-4 rounded-lg font-bold text-lg hover:from-gold-600 hover:to-gold-700 transition shadow-gold-soft"
                >
                  {t('cart.proceedToCheckout')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

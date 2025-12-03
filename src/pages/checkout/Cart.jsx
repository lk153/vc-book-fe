import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Home, AlertTriangle } from 'lucide-react';
import CartItem from '../../components/CartItem';
import { useTranslation } from '../../i18n/LanguageContext';

export default function Cart({ cart, isGuest, updateCartQuantity, setShowOrderForm, getTotalPrice }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <Home size={20} />
                        <span>{t('cart.continueShopping')}</span>
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">{t('cart.title')}</h1>

                {/* Guest Warning */}
                {isGuest && cart.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={24} />
                        <div>
                            <p className="text-yellow-800 font-medium mb-1">{t('cart.guestWarning')}</p>
                            <p className="text-yellow-700 text-sm">
                                {t('cart.guestMessage')}
                                <Link to="/login" className="font-medium underline ml-1">
                                    Login
                                </Link> to sync your cart and place orders.
                            </p>
                        </div>
                    </div>
                )}

                {cart.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t('cart.empty')}</h2>
                        <p className="text-gray-500 mb-6">{t('cart.emptyMessage')}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            {t('cart.browseBooks')}
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="divide-y divide-gray-200">
                            {cart.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    updateCartQuantity={updateCartQuantity}
                                />
                            ))}
                        </div>

                        <div className="bg-gray-50 p-6 border-t-2 border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-2xl font-bold text-gray-800">{t('common.total')}</span>
                                <span className="text-3xl font-bold text-blue-600">${getTotalPrice()}</span>
                            </div>

                            {isGuest ? (
                                <Link
                                    to="/login"
                                    className="block w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition text-center"
                                >
                                    {t('cart.loginToCheckout')}
                                </Link>
                            ) : (
                                <button
                                    onClick={() => setShowOrderForm(true)}
                                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
                                >
                                    {t('cart.proceedToCheckout')}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
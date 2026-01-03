
import { useNavigate } from 'react-router-dom';
import { Home, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';

export default function OrderSuccess({ setOrderSuccess, orderData }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => {
                            setOrderSuccess(false);
                            navigate('/');
                        }}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <Home size={20} />
                        <span>{t('nav.backToHome')}</span>
                    </button>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('checkout.orderSuccess')}</h1>
                    <p className="text-gray-600 mb-6">{t('checkout.thankYou')}</p>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                        <h2 className="font-bold text-lg mb-3">{t('checkout.orderDetails')}</h2>
                        <p className="text-gray-700 mb-2">
                            <span className="font-semibold">{t('checkout.orderNumber')}:</span> {orderData.orderNumber}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <span className="font-semibold">{t('checkout.total')}:</span> ${orderData.summary?.total?.toFixed(2)}
                        </p>
                        <p className="text-gray-700 mb-2">
                            <span className="font-semibold">{t('checkout.status')}:</span> {orderData.status}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-semibold">{t('checkout.deliveryAddress')}:</span><br />
                            {orderData.shippingAddress.address}, {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.postalCode}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setOrderSuccess(false);
                            navigate('/');
                        }}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        {t('checkout.continueShopping')}
                    </button>
                </div>
            </div>
        </div>
    )
}
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CheckCircle, Package } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatPrice } from '../../utils/price';

export function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const orderData = location.state?.orderData;

  const getStatusLabel = (status) => {
    const statusKey = status?.toLowerCase();
    const statusMap = {
      pending: t('orders.statusPending'),
      processing: t('orders.statusProcessing'),
      shipped: t('orders.statusShipped'),
      delivered: t('orders.statusDelivered'),
      cancelled: t('orders.statusCancelled'),
      refunded: t('orders.statusRefunded'),
    };
    return statusMap[statusKey] || status;
  };

  const getStatusColor = (status) => {
    const statusKey = status?.toLowerCase();
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      refunded: 'bg-orange-100 text-orange-700',
    };
    return colorMap[statusKey] || 'bg-gray-100 text-gray-700';
  };

  // If no order data, show a generic success or redirect
  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Home size={20} />
              <span>{t('nav.backToHome')}</span>
            </button>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('checkout.noOrderFound')}</h1>
            <p className="text-gray-600 mb-6">{t('checkout.noOrderMessage')}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/orders')}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
              >
                {t('checkout.viewMyOrders')}
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                {t('checkout.continueShopping')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
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
              <span className="font-semibold">{t('checkout.total')}:</span> {formatPrice(orderData.summary?.total)}{t('common.currencySymbol')}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">{t('checkout.status')}:</span>{' '}
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}>
                {getStatusLabel(orderData.status)}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">{t('checkout.deliveryAddress')}:</span><br />
              {orderData.shippingAddress?.address}, {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} {orderData.shippingAddress?.postalCode}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/orders')}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              {t('checkout.viewMyOrders')}
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {t('checkout.continueShopping')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

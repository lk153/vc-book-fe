import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Loader2,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTranslation, useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from './useOrders';
import { Navigation } from '../../components/Navigation';
import { formatPrice } from '../../utils/price';

export function OrdersPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, isLoading, error } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.warning(t('orders.loginToView'));
      navigate('/login');
    }
  }, [user, navigate, t]);

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || '';

    const styles = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: t('orders.statusPending') },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Package, label: t('orders.statusProcessing') },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Truck, label: t('orders.statusShipped') },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: t('orders.statusDelivered') },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: t('orders.statusCancelled') },
      completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: t('orders.statusCompleted') },
    };

    const style = styles[statusLower] || styles.pending;
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
        <Icon size={16} />
        {style.label}
      </span>
    );
  };

  // Format date based on language
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation showBackButton={true} />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-xl text-gray-600">{t("orders.loadingOrders")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation showBackButton={true} />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <XCircle className="mx-auto text-red-500 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-red-700 mb-2">{t('orders.errorLoading')}</h2>
            <p className="text-red-600 mb-6">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation showBackButton={true} />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('orders.title')}</h1>
            <p className="text-gray-600">{t("orders.track")}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
            <Package className="text-blue-600" size={20} />
            <span className="text-sm font-semibold text-gray-700">
              {orders.length} {orders.length === 1 ? t("orders.order") : t("orders.orders")}
            </span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t("orders.noOrders")}</h2>
            <p className="text-gray-500 mb-6">{t("orders.startShopping")}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              {t("cart.browseBooks")}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id || order.id || order.orderNumber}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition hover:shadow-xl"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {t('orders.order')} #{order.orderNumber || order._id?.slice(-8) || 'N/A'}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{formatDate(order.createdAt || order.orderDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold">{formatPrice(order.summary?.total || order.totalAmount || '0')}{t('common.currencySymbol')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package size={16} />
                          <span>{order.items?.length || 0} {order.items?.length === 1 ? t('orders.item') : t('orders.items')}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleOrderDetails(order._id || order.id)}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                    >
                      <span className="text-sm font-medium">
                        {expandedOrder === (order._id || order.id) ? t('orders.hideDetails') : t('orders.viewDetails')}
                      </span>
                      {expandedOrder === (order._id || order.id) ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Order Details (Expandable) */}
                {expandedOrder === (order._id || order.id) && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Shipping Address */}
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <MapPin size={20} className="text-blue-600" />
                          {t('orders.shippingAddress')}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-semibold">{order.shippingAddress?.fullName || 'N/A'}</p>
                          <p>{order.shippingAddress?.address}</p>
                          <p>
                            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                          </p>
                          <p>{order.shippingAddress?.country || 'USA'}</p>
                          {order.shippingAddress?.phone && (
                            <p className="flex items-center gap-1 mt-2">
                              <Phone size={14} />
                              {order.shippingAddress.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <DollarSign size={20} className="text-blue-600" />
                          {t('orders.paymentDetails')}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-2">
                          <div className="flex justify-between">
                            <span>{t('orders.paymentMethod')}:</span>
                            <span className="font-semibold">{order.paymentMethod || 'N/A'}</span>
                          </div>
                          {order.summary && (
                            <>
                              <div className="flex justify-between">
                                <span>{t('common.subtotal')}:</span>
                                <span>{formatPrice((order.summary.subtotal))}{t('common.currencySymbol')}</span>
                              </div>
                              {order.summary.tax > 0 && (
                                <div className="flex justify-between">
                                  <span>{t('checkout.tax')}:</span>
                                  <span>{formatPrice((order.summary.tax))}{t('common.currencySymbol')}</span>
                                </div>
                              )}
                              {order.summary.shipping > 0 && (
                                <div className="flex justify-between">
                                  <span>{t('checkout.shipping')}:</span>
                                  <span>{formatPrice((order.summary.shipping))}{t('common.currencySymbol')}</span>
                                </div>
                              )}
                              <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="font-bold">{t('common.total')}:</span>
                                <span className="font-bold text-blue-600">
                                  {formatPrice((order.summary.total))}{t('common.currencySymbol')}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Package size={20} className="text-blue-600" />
                        {t('orders.orderItems')}
                      </h4>
                      <div className="space-y-3">
                        {order.items?.map((item, index) => (
                          <div
                            key={item._id || index}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={item.book?.coverImage || item.book?.image || item.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop'}
                              alt={item.book?.title || item.title || 'Book'}
                              className="w-16 h-20 object-contain rounded"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop';
                              }}
                            />
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800">
                                {item.book?.title || item.title || 'Unknown Book'}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {item.book?.author || item.author || 'Unknown Author'}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {t('orders.quantity')}: {item.quantity} × {formatPrice((item.price))}{t('common.currencySymbol')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-800">
                                {formatPrice((item.price || 0) * (item.quantity || 0))}{t('common.currencySymbol')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {order.status?.toLowerCase() === 'pending' && (
                        <button
                          onClick={() => toast.info(t('orders.cancelSoon'))}
                          className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-medium"
                        >
                          {t('orders.cancelOrder')}
                        </button>
                      )}
                      <button
                        onClick={() => toast.info(t('orders.trackSoon'))}
                        className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                      >
                        {t('orders.trackOrder')}
                      </button>
                      <button
                        onClick={() => toast.info(t('orders.invoiceSoon'))}
                        className="px-4 py-2 border-2 border-gray-600 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium"
                      >
                        {t('orders.downloadInvoice')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

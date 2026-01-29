import { Loader2, X, MapPin, Phone, DollarSign, Package } from 'lucide-react';
import { useAdminOrderDetail } from '../hooks/useAdminOrders';
import { getStatusStyles, getStatusLabel as getStatusLabelFromConstants } from '../../../constants/orders';

export function OrderDetailsModal({ orderId, onClose, t, formatDate, formatPrice }) {
  const { order, isLoading } = useAdminOrderDetail(orderId);

  const getStatusColor = (status) => {
    const config = getStatusStyles(status);
    return `${config.bg} ${config.text} border ${config.border}`;
  };

  const getStatusLabel = (status) => {
    return getStatusLabelFromConstants(status, t);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl p-12 flex flex-col items-center">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-gray-600">{t('admin.common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl p-12 text-center">
          <p className="text-gray-600 mb-4">{t('admin.orders.noOrders')}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            {t('admin.common.cancel')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {t('admin.orders.orderDetails')} #{order.orderNumber || order._id?.slice(-8)}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                <span className={`w-2 h-2 rounded-full ${getStatusStyles(order.status).dot}`} />
                {getStatusLabel(order.status)}
              </span>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          {/* Two-column layout for Shipping and Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Shipping Address */}
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" />
                {t('admin.orders.shippingAddress')}
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-semibold">{order.shippingAddress?.fullName || order.user?.name || t('common.notAvailable')}</p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country || 'VN'}</p>
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
                {t('admin.orders.paymentMethod')}
              </h4>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>{t('admin.orders.paymentMethod')}:</span>
                  <span className="font-semibold">{order.paymentMethod || t('checkout.cashOnDelivery')}</span>
                </div>
                {order.summary && (
                  <>
                    <div className="flex justify-between">
                      <span>{t('common.subtotal')}:</span>
                      <span>{formatPrice(order.summary.subtotal)}{t('common.currencySymbol')}</span>
                    </div>
                    {order.summary.tax > 0 && (
                      <div className="flex justify-between">
                        <span>{t('checkout.tax')}:</span>
                        <span>{formatPrice(order.summary.tax)}{t('common.currencySymbol')}</span>
                      </div>
                    )}
                    {order.summary.shipping > 0 && (
                      <div className="flex justify-between">
                        <span>{t('checkout.shipping')}:</span>
                        <span>{formatPrice(order.summary.shipping)}{t('common.currencySymbol')}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-bold">{t('common.total')}:</span>
                      <span className="font-bold text-blue-600">
                        {formatPrice(order.summary.total)}{t('common.currencySymbol')}
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
              {t('admin.orders.orderItems')}
            </h4>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div
                  key={item._id || index}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <img
                    src={item.book?.coverImage || item.book?.image || item.coverImage || item.image}
                    alt={item.book?.title || item.title || 'Book'}
                    className="w-16 h-20 object-contain rounded"
                  />
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800">
                      {item.book?.title || item.title || 'Unknown Book'}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {item.book?.author || item.author || 'Unknown Author'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('orders.quantity')}: {item.quantity} × {formatPrice(item.price)}{t('common.currencySymbol')}
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
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-white">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            {t('admin.common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}

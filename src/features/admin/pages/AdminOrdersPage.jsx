import { useState } from 'react';
import { toast } from 'react-toastify';
import { Eye, RefreshCw, MapPin, Phone, DollarSign, Package, X, Loader2 } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { DataTable } from '../components/DataTable';
import { useAdminOrders, useUpdateOrderStatus, useAdminOrderDetail } from '../hooks/useAdminOrders';
import { useTranslation, useLanguage } from '../../../i18n/LanguageContext';
import { formatPrice } from '../../../utils/price';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export function AdminOrdersPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [filters] = useState({ page: 1, limit: 10 });
  const [expandedOrder, setExpandedOrder] = useState(null);

  const { orders, isLoading, refetch } = useAdminOrders(filters);
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateStatus.mutateAsync({ orderId, status: newStatus });
      toast.success(t('admin.orders.statusUpdated'));
    } catch (error) {
      toast.error(error.message || t('admin.orders.updateFailed'));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: t('admin.orders.statusPending'),
      processing: t('admin.orders.statusProcessing'),
      shipped: t('admin.orders.statusShipped'),
      delivered: t('admin.orders.statusDelivered'),
      cancelled: t('admin.orders.statusCancelled'),
      completed: t('admin.orders.statusCompleted'),
    };
    return labels[status?.toLowerCase()] || status;
  };

  const columns = [
    {
      key: 'orderNumber',
      label: t('admin.orders.orderNumber'),
      render: (row) => (
        <span className="font-medium">
          #{row.orderNumber || row._id?.slice(-8)}
        </span>
      )
    },
    {
      key: 'customer',
      label: t('admin.orders.customer'),
      render: (row) => row.user?.name || row.shippingAddress?.fullName || 'N/A'
    },
    {
      key: 'date',
      label: t('admin.orders.date'),
      render: (row) => formatDate(row.createdAt)
    },
    {
      key: 'items',
      label: t('admin.orders.items'),
      render: (row) => row.items?.length || 0
    },
    {
      key: 'total',
      label: t('admin.orders.total'),
      render: (row) => (
        <span className="font-semibold">
          {formatPrice(row.summary?.total || row.totalAmount)}₫
        </span>
      )
    },
    {
      key: 'status',
      label: t('admin.orders.status'),
      render: (row) => (
        <select
          value={row.status?.toLowerCase()}
          onChange={(e) => {
            e.stopPropagation();
            handleStatusChange(row._id || row.id, e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </select>
      )
    },
    {
      key: 'actions',
      label: t('admin.common.actions'),
      render: (row) => {
        const orderId = row._id || row.id;
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandedOrder(expandedOrder === orderId ? null : orderId);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title={t('admin.orders.viewOrder')}
          >
            <Eye size={18} />
          </button>
        );
      }
    }
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('admin.orders.title')}</h1>
          <p className="text-gray-600 mt-1">{t('admin.orders.subtitle')}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw size={18} />
          {t('admin.common.refresh')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          emptyMessage={t('admin.orders.noOrders')}
        />
      </div>

      {/* Expanded Order Details */}
      {expandedOrder && (
        <OrderDetailsModal
          orderId={expandedOrder}
          onClose={() => setExpandedOrder(null)}
          t={t}
          formatDate={formatDate}
          formatPrice={formatPrice}
        />
      )}
    </AdminLayout>
  );
}

function OrderDetailsModal({ orderId, onClose, t, formatDate, formatPrice }) {
  const { order, isLoading } = useAdminOrderDetail(orderId);

  const getStatusColor = (status) => {
    const statusKey = status?.toLowerCase();
    const colorMap = {
      pending: 'bg-orange-100 text-orange-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-green-100 text-green-700',
    };
    return colorMap[statusKey] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: t('admin.orders.statusPending'),
      processing: t('admin.orders.statusProcessing'),
      shipped: t('admin.orders.statusShipped'),
      delivered: t('admin.orders.statusDelivered'),
      cancelled: t('admin.orders.statusCancelled'),
      completed: t('admin.orders.statusCompleted'),
    };
    return labels[status?.toLowerCase()] || status;
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
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
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
                <p className="font-semibold">{order.shippingAddress?.fullName || order.user?.name || 'N/A'}</p>
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

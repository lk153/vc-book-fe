import { useState } from 'react';
import { toast } from 'react-toastify';
import { Eye, RefreshCw } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { DataTable } from '../components/DataTable';
import { useAdminOrders, useUpdateOrderStatus } from '../hooks/useAdminOrders';
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
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpandedOrder(expandedOrder === row._id ? null : row._id);
          }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          title={t('admin.orders.viewOrder')}
        >
          <Eye size={18} />
        </button>
      )
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
          order={orders.find(o => o._id === expandedOrder)}
          onClose={() => setExpandedOrder(null)}
          t={t}
          formatDate={formatDate}
          formatPrice={formatPrice}
        />
      )}
    </AdminLayout>
  );
}

function OrderDetailsModal({ order, onClose, t, formatDate, formatPrice }) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {t('admin.orders.orderDetails')} #{order.orderNumber || order._id?.slice(-8)}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">{t('admin.orders.customer')}</h3>
            <p className="text-gray-600">{order.user?.name || order.shippingAddress?.fullName}</p>
            <p className="text-gray-600">{order.user?.email}</p>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">{t('admin.orders.shippingAddress')}</h3>
            <div className="text-gray-600">
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
              <p>{order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">{t('admin.orders.orderItems')}</h3>
            <div className="space-y-2">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.book?.title || item.title}</p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.quantity)}₫</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>{t('common.total')}</span>
              <span className="text-blue-600">{formatPrice(order.summary?.total || order.totalAmount)}₫</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            {t('admin.common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}

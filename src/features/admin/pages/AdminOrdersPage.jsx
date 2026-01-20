import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { RefreshCw, X, Truck, AlertTriangle, Eye, Check, Download } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { DataTable } from '../components/DataTable';
import { OrderDetailsModal } from '../components/OrderDetailsModal';
import { StatusBadgeDropdown } from '../components/StatusBadgeDropdown';
import { ActionsMenu } from '../components/ActionsMenu';
import { useAdminOrders, useUpdateOrderStatus } from '../hooks/useAdminOrders';
import { useTranslation, useLanguage } from '../../../i18n/LanguageContext';
import { formatPrice } from '../../../utils/price';

export function AdminOrdersPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [filters] = useState({ page: 1, limit: 10 });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkAction, setBulkAction] = useState(null);

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

  const handleSelectAll = useCallback((e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(o => o._id || o.id));
    } else {
      setSelectedOrders([]);
    }
  }, [orders]);

  const handleSelectOrder = useCallback((orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  }, []);

  const handleBulkAction = (action) => {
    if (selectedOrders.length === 0) {
      toast.warning(t('admin.orders.selectOrdersFirst'));
      return;
    }
    if (action === 'cancelled') {
      setBulkAction(action);
      setShowBulkConfirm(true);
    } else {
      executeBulkAction(action);
    }
  };

  const executeBulkAction = async (action) => {
    if (action === 'export') {
      toast.info(t('admin.orders.exportSoon'));
      return;
    }

    try {
      await Promise.all(
        selectedOrders.map(orderId =>
          updateStatus.mutateAsync({ orderId, status: action })
        )
      );
      toast.success(t('admin.orders.bulkStatusUpdated', { count: selectedOrders.length }));
      setSelectedOrders([]);
    } catch (error) {
      toast.error(error.message || t('admin.orders.bulkUpdateFailed'));
    }
    setShowBulkConfirm(false);
    setBulkAction(null);
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
      refunded: t('admin.orders.statusRefunded'),
    };
    return labels[status?.toLowerCase()] || status;
  };

  const columns = [
    {
      key: 'checkbox',
      label: (
        <input
          type="checkbox"
          checked={orders.length > 0 && selectedOrders.length === orders.length}
          onChange={handleSelectAll}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      render: (row) => {
        const orderId = row._id || row.id;
        return (
          <input
            type="checkbox"
            checked={selectedOrders.includes(orderId)}
            onChange={(e) => {
              e.stopPropagation();
              handleSelectOrder(orderId);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        );
      }
    },
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
        <StatusBadgeDropdown
          status={row.status}
          orderId={row._id || row.id}
          onStatusChange={handleStatusChange}
          t={t}
          getStatusLabel={getStatusLabel}
        />
      )
    },
    {
      key: 'actions',
      label: t('admin.common.actions'),
      render: (row) => {
        const orderId = row._id || row.id;
        return (
          <div className="flex items-center gap-1">
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
            <ActionsMenu
              order={row}
              onView={() => setExpandedOrder(orderId)}
              t={t}
            />
          </div>
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

      {/* Bulk Actions Toolbar */}
      {selectedOrders.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-800">
              {t('admin.orders.selectedCount', { count: selectedOrders.length })}
            </span>
            <button
              onClick={() => setSelectedOrders([])}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {t('admin.orders.clearSelection')}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('shipped')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
            >
              <Truck size={16} />
              {t('admin.orders.markShipped')}
            </button>
            <button
              onClick={() => handleBulkAction('delivered')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
            >
              <Check size={16} />
              {t('admin.orders.markDelivered')}
            </button>
            <button
              onClick={() => handleBulkAction('export')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
            >
              <Download size={16} />
              {t('admin.orders.exportSelected')}
            </button>
            <button
              onClick={() => handleBulkAction('cancelled')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
            >
              <X size={16} />
              {t('admin.orders.cancelSelected')}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          emptyMessage={t('admin.orders.noOrders')}
        />
      </div>

      {/* Bulk Action Confirmation Modal */}
      {showBulkConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowBulkConfirm(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t('admin.orders.confirmBulkCancel')}</h3>
            </div>
            <p className="text-gray-600 mb-6">
              {t('admin.orders.confirmBulkCancelMessage', { count: selectedOrders.length })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                {t('admin.common.cancel')}
              </button>
              <button
                onClick={() => executeBulkAction(bulkAction)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {t('admin.orders.cancelOrders')}
              </button>
            </div>
          </div>
        </div>
      )}

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

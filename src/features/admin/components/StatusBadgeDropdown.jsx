import { useState, useRef, useEffect } from 'react';
import { Check, AlertTriangle } from 'lucide-react';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

const STATUS_CONFIG = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', hover: 'hover:bg-yellow-200', dot: 'bg-yellow-500' },
  processing: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', hover: 'hover:bg-blue-200', dot: 'bg-blue-500' },
  shipped: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300', hover: 'hover:bg-indigo-200', dot: 'bg-indigo-500' },
  delivered: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', hover: 'hover:bg-green-200', dot: 'bg-green-500' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', hover: 'hover:bg-red-200', dot: 'bg-red-500' },
  refunded: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', hover: 'hover:bg-orange-200', dot: 'bg-orange-500' },
};

export function StatusBadgeDropdown({ status, orderId, onStatusChange, t, getStatusLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const dropdownRef = useRef(null);

  const currentStatus = status?.toLowerCase() || 'pending';
  const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStatusSelect = (newStatus) => {
    if (newStatus === 'cancelled') {
      setPendingStatus(newStatus);
      setShowConfirm(true);
      setIsOpen(false);
    } else {
      onStatusChange(orderId, newStatus);
      setIsOpen(false);
    }
  };

  const confirmStatusChange = () => {
    if (pendingStatus) {
      onStatusChange(orderId, pendingStatus);
    }
    setShowConfirm(false);
    setPendingStatus(null);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border cursor-pointer transition-colors ${config.bg} ${config.text} ${config.border} ${config.hover}`}
        >
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          {getStatusLabel(currentStatus)}
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 left-0">
            {ORDER_STATUSES.map((s) => {
              const sConfig = STATUS_CONFIG[s] || STATUS_CONFIG.pending;
              const isActive = s === currentStatus;
              return (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusSelect(s);
                  }}
                  disabled={isActive}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                    isActive ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${sConfig.dot}`} />
                  <span className={isActive ? 'font-medium' : ''}>{getStatusLabel(s)}</span>
                  {isActive && <Check size={14} className="ml-auto text-gray-500" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal for destructive actions */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t('admin.orders.confirmCancel')}</h3>
            </div>
            <p className="text-gray-600 mb-6">{t('admin.orders.confirmCancelMessage')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                {t('admin.common.cancel')}
              </button>
              <button
                onClick={confirmStatusChange}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {t('admin.orders.cancelOrder')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

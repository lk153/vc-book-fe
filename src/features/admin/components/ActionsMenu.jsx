import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Eye, MoreHorizontal, FileText, Download, CreditCard } from 'lucide-react';

export function ActionsMenu({ order, onView, t }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action) => {
    setIsOpen(false);
    switch (action) {
      case 'view':
        onView();
        break;
      case 'refund':
        toast.info(t('admin.orders.refundSoon'));
        break;
      case 'print':
        toast.info(t('admin.orders.printSoon'));
        break;
      case 'export':
        toast.info(t('admin.orders.exportSoon'));
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
        title={t('admin.common.actions')}
      >
        <MoreHorizontal size={18} />
      </button>

      {isOpen && (
        <div className="absolute z-20 right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
          <button
            onClick={(e) => { e.stopPropagation(); handleAction('view'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition"
          >
            <Eye size={16} className="text-gray-500" />
            {t('admin.orders.viewOrder')}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleAction('refund'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition"
          >
            <CreditCard size={16} className="text-gray-500" />
            {t('admin.orders.refund')}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleAction('print'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition"
          >
            <FileText size={16} className="text-gray-500" />
            {t('admin.orders.printInvoice')}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleAction('export'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition"
          >
            <Download size={16} className="text-gray-500" />
            {t('admin.orders.exportOrder')}
          </button>
        </div>
      )}
    </div>
  );
}

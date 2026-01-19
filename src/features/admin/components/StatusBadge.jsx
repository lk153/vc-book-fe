import { useTranslation } from '../../../i18n/LanguageContext';

export function StatusBadge({ status, type = 'order' }) {
  const { t } = useTranslation();

  const orderStyles = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-700' },
    shipped: { bg: 'bg-purple-100', text: 'text-purple-700' },
    delivered: { bg: 'bg-green-100', text: 'text-green-700' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
    completed: { bg: 'bg-green-100', text: 'text-green-700' },
  };

  const userStyles = {
    active: { bg: 'bg-green-100', text: 'text-green-700' },
    banned: { bg: 'bg-red-100', text: 'text-red-700' },
  };

  const styles = type === 'user' ? userStyles : orderStyles;
  const statusKey = status?.toLowerCase() || 'pending';
  const style = styles[statusKey] || styles.pending || { bg: 'bg-gray-100', text: 'text-gray-700' };

  // Get translated label
  let label = status;
  if (type === 'order') {
    const orderLabels = {
      pending: t('admin.orders.statusPending'),
      processing: t('admin.orders.statusProcessing'),
      shipped: t('admin.orders.statusShipped'),
      delivered: t('admin.orders.statusDelivered'),
      cancelled: t('admin.orders.statusCancelled'),
      completed: t('admin.orders.statusCompleted'),
    };
    label = orderLabels[statusKey] || status;
  } else if (type === 'user') {
    const userLabels = {
      active: t('admin.users.statusActive'),
      banned: t('admin.users.statusBanned'),
    };
    label = userLabels[statusKey] || status;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
      {label}
    </span>
  );
}

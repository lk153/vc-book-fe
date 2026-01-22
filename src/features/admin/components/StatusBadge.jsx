import { useTranslation } from '../../../i18n/LanguageContext';
import { getStatusStyles, getStatusLabel } from '../../../constants/orders';

// User status configuration (kept local as it's only used here)
const userStyles = {
  active: { bg: 'bg-green-100', text: 'text-green-700' },
  banned: { bg: 'bg-red-100', text: 'text-red-700' },
};

export function StatusBadge({ status, type = 'order' }) {
  const { t } = useTranslation();

  const statusKey = status?.toLowerCase() || 'pending';

  // Get style based on type
  let style;
  let label;

  if (type === 'user') {
    style = userStyles[statusKey] || { bg: 'bg-gray-100', text: 'text-gray-700' };
    const userLabels = {
      active: t('admin.users.statusActive'),
      banned: t('admin.users.statusBanned'),
    };
    label = userLabels[statusKey] || status;
  } else {
    // Order type - use centralized constants
    const orderStyle = getStatusStyles(status);
    style = { bg: orderStyle.bg, text: orderStyle.text };
    label = getStatusLabel(status, t);
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${style.bg} ${style.text}`}>
      {label}
    </span>
  );
}

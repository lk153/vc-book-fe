/**
 * Order status constants and configuration
 * Centralized location for all order status-related constants
 */

// Order status values
export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
];

// Status configuration with styling for different use cases
// Traditional Chinese theme colors
export const STATUS_CONFIG = {
  pending: {
    bg: 'bg-gold-100',
    text: 'text-gold-700',
    textDark: 'text-gold-800',
    border: 'border-gold-300',
    hover: 'hover:bg-gold-200',
    dot: 'bg-gold-500'
  },
  processing: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    textDark: 'text-blue-800',
    border: 'border-blue-300',
    hover: 'hover:bg-blue-200',
    dot: 'bg-blue-500'
  },
  shipped: {
    bg: 'bg-brown-100',
    text: 'text-brown-600',
    textDark: 'text-brown-700',
    border: 'border-brown-300',
    hover: 'hover:bg-brown-200',
    dot: 'bg-brown-500'
  },
  delivered: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    textDark: 'text-green-800',
    border: 'border-green-300',
    hover: 'hover:bg-green-200',
    dot: 'bg-green-500'
  },
  cancelled: {
    bg: 'bg-crimson-100',
    text: 'text-crimson-500',
    textDark: 'text-crimson-600',
    border: 'border-crimson-300',
    hover: 'hover:bg-crimson-200',
    dot: 'bg-crimson-400'
  },
  refunded: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    textDark: 'text-orange-800',
    border: 'border-orange-300',
    hover: 'hover:bg-orange-200',
    dot: 'bg-orange-500'
  }
};

// Default fallback configuration
const DEFAULT_CONFIG = {
  bg: 'bg-gray-100',
  text: 'text-gray-700',
  textDark: 'text-gray-800',
  border: 'border-gray-300',
  hover: 'hover:bg-gray-200',
  dot: 'bg-gray-500'
};

/**
 * Get style configuration for a given status
 * @param {string} status - The order status
 * @returns {Object} Style configuration object
 */
export const getStatusStyles = (status) => {
  const statusKey = status?.toLowerCase() || 'pending';
  return STATUS_CONFIG[statusKey] || DEFAULT_CONFIG;
};

/**
 * Get combined CSS classes for status badge
 * @param {string} status - The order status
 * @returns {string} Combined CSS class string
 */
export const getStatusBadgeClasses = (status) => {
  const config = getStatusStyles(status);
  return `${config.bg} ${config.text}`;
};

/**
 * Get translated label for a status using the translation function
 * @param {string} status - The order status
 * @param {Function} t - Translation function
 * @returns {string} Translated status label
 */
export const getStatusLabel = (status, t) => {
  const statusKey = status?.toLowerCase() || 'pending';
  const translationKeys = {
    pending: 'admin.orders.statusPending',
    processing: 'admin.orders.statusProcessing',
    shipped: 'admin.orders.statusShipped',
    delivered: 'admin.orders.statusDelivered',
    cancelled: 'admin.orders.statusCancelled',
    refunded: 'admin.orders.statusRefunded'
  };

  const key = translationKeys[statusKey];
  return key ? t(key) : status;
};

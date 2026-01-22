/**
 * Centralized route configuration
 * All route paths should be defined here to prevent typos and make route changes easier
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  BOOK_DETAIL: '/book/:bookId',
  CART: '/cart',
  CHECKOUT: '/checkout',

  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Protected routes
  PROFILE: '/profile',
  ORDERS: '/orders',
  SETTINGS: '/settings',
  SHIPPING_ADDRESS: '/shipping-address',
  ORDER_SUCCESS: '/order-success',

  // Admin routes
  ADMIN_LOGIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_BOOKS: '/admin/books',
  ADMIN_BOOKS_NEW: '/admin/books/new',
  ADMIN_BOOKS_EDIT: '/admin/books/:bookId/edit',
};

/**
 * Helper function to generate dynamic route paths
 * @param {string} route - Route template with :param placeholders
 * @param {Object} params - Object with param values to replace
 * @returns {string} Route with params replaced
 */
export const generatePath = (route, params = {}) => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
};

/**
 * Convenience function for book detail route
 * @param {string} bookId - The book ID
 * @returns {string} Book detail path
 */
export const getBookDetailPath = (bookId) => {
  return generatePath(ROUTES.BOOK_DETAIL, { bookId });
};

/**
 * Convenience function for admin book edit route
 * @param {string} bookId - The book ID
 * @returns {string} Admin book edit path
 */
export const getAdminBookEditPath = (bookId) => {
  return generatePath(ROUTES.ADMIN_BOOKS_EDIT, { bookId });
};

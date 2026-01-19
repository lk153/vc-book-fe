import { apiClient } from './apiClient';

// Cart API
export const cartAPI = {
  // Get user's cart
  get: async (userId) => {
    return apiClient.get(`/cart/${userId}`);
  },

  // Add item to cart
  addItem: async (userId, bookId, quantity) => {
    return apiClient.post('/cart/add', { userId, bookId, quantity });
  },

  // Update cart item quantity
  updateItem: async (userId, bookId, quantity) => {
    return apiClient.put('/cart/update', { userId, bookId, quantity });
  },

  // Remove item from cart
  removeItem: async (userId, bookId) => {
    return apiClient.delete(`/cart/${userId}/items/${bookId}`);
  },

  // Clear cart
  clear: async (userId) => {
    return apiClient.delete(`/cart/${userId}`);
  },
};

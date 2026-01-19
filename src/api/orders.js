import { apiClient } from './apiClient';

// Orders API
export const ordersAPI = {
  // Place a new order
  place: async (orderData) => {
    return apiClient.post('/orders/place', orderData);
  },

  // Get order by ID
  getById: async (orderId) => {
    return apiClient.get(`/orders/${orderId}`);
  },

  // Get all orders for a user
  getUserOrders: async (userId) => {
    return apiClient.get(`/orders/user/${userId}`);
  },

  // Update order status (admin)
  updateStatus: async (orderId, status) => {
    return apiClient.put(`/orders/${orderId}/status`, { status });
  },

  // Cancel order
  cancel: async (orderId) => {
    return apiClient.delete(`/orders/${orderId}`);
  },
};

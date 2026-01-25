import { apiClient } from './apiClient';

// Categories API (public)
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    return apiClient.get('/categories');
  },

  // Get category by ID
  getById: async (categoryId) => {
    return apiClient.get(`/categories/${categoryId}`);
  },
};

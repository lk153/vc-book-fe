import { apiClient } from './apiClient';

// Categories constant
export const CATEGORIES = [
  "Tất cả",
  "Tiểu đệ tử",
];

// Books API
export const booksAPI = {
  // Get all books with filters
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    if (filters.category && filters.category !== 'Tất cả') {
      queryParams.append('category', filters.category);
    }
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    if (filters.minPrice) {
      queryParams.append('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
      queryParams.append('maxPrice', filters.maxPrice);
    }
    if (filters.page) {
      queryParams.append('page', filters.page);
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit);
    }

    return apiClient.get(`/books?${queryParams}`);
  },

  // Get book by ID
  getById: async (bookId) => {
    return apiClient.get(`/books/${bookId}`);
  },

  // Create a new book (admin)
  create: async (bookData) => {
    return apiClient.post('/books', bookData);
  },

  // Update a book (admin)
  update: async (bookId, bookData) => {
    return apiClient.put(`/books/${bookId}`, bookData);
  },

  // Delete a book (admin)
  delete: async (bookId) => {
    return apiClient.delete(`/books/${bookId}`);
  },
};

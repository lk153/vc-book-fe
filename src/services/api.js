// services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

// Utility function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Books API
export const booksAPI = {
  // Get all books with filters
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.category && filters.category !== 'All') {
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
    
    const response = await fetch(`${API_BASE_URL}/books?${queryParams}`);
    return handleResponse(response);
  },

  // Get book by ID
  getById: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
    return handleResponse(response);
  },

  // Create a new book (admin)
  create: async (bookData) => {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    return handleResponse(response);
  },

  // Update a book (admin)
  update: async (bookId, bookData) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    return handleResponse(response);
  },

  // Delete a book (admin)
  delete: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Cart API
export const cartAPI = {
  // Get user's cart
  get: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
    return handleResponse(response);
  },

  // Add item to cart
  addItem: async (userId, bookId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, bookId, quantity }),
    });
    return handleResponse(response);
  },

  // Update cart item quantity
  updateItem: async (userId, bookId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, bookId, quantity }),
    });
    return handleResponse(response);
  },

  // Remove item from cart
  removeItem: async (userId, bookId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}/items/${bookId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Clear cart
  clear: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Orders API
export const ordersAPI = {
  // Place a new order
  place: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders/place`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  // Get order by ID
  getById: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    return handleResponse(response);
  },

  // Get all orders for a user
  getUserOrders: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
    return handleResponse(response);
  },

  // Update order status (admin)
  updateStatus: async (orderId, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  // Cancel order
  cancel: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Categories constant (for filtering)
export const CATEGORIES = [
  "Tất cả",
  "Tiểu đệ tử",
];

// Combined API object
const api = {
  books: booksAPI,
  cart: cartAPI,
  orders: ordersAPI,
};

export default api;
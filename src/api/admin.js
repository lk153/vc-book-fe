const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

// Store admin auth error callback globally
let onAdminAuthError = null;

export const setAdminAuthErrorHandler = (handler) => {
  onAdminAuthError = handler;
};

// Utility function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // Check for 401 errors - admin session expired
    if (response.status === 401 && onAdminAuthError) {
      onAdminAuthError();
    }
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Get admin auth token (separate from customer token)
const getAdminAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Admin API client
const adminClient = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminAuthHeader(),
      },
    });
    return handleResponse(response);
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminAuthHeader(),
      },
    });
    return handleResponse(response);
  },
};

// Admin token manager
export const adminTokenManager = {
  setToken: (token) => {
    localStorage.setItem('adminToken', token);
  },
  getToken: () => {
    return localStorage.getItem('adminToken');
  },
  removeToken: () => {
    localStorage.removeItem('adminToken');
  },
};

// Admin user manager
export const adminUserManager = {
  setAdmin: (admin) => {
    localStorage.setItem('adminUser', JSON.stringify(admin));
  },
  getAdmin: () => {
    const admin = localStorage.getItem('adminUser');
    return admin ? JSON.parse(admin) : null;
  },
  removeAdmin: () => {
    localStorage.removeItem('adminUser');
  },
};

// Admin API endpoints
export const adminAPI = {
  // Authentication
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  logout: async () => {
    return adminClient.post('/admin/logout');
  },

  getMe: async () => {
    return adminClient.get('/admin/me');
  },

  // Dashboard
  getDashboardStats: async () => {
    return adminClient.get('/admin/dashboard/stats');
  },

  // Orders Management
  getAllOrders: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.search) queryParams.append('search', filters.search);
    const queryString = queryParams.toString();
    return adminClient.get(`/admin/orders${queryString ? `?${queryString}` : ''}`);
  },

  getOrderById: async (orderId) => {
    return adminClient.get(`/admin/orders/${orderId}`);
  },

  updateOrderStatus: async (orderId, status) => {
    return adminClient.put(`/admin/orders/${orderId}/status`, { status });
  },

  // Users Management
  getAllUsers: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.status) queryParams.append('status', filters.status);
    const queryString = queryParams.toString();
    return adminClient.get(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  getUserById: async (userId) => {
    return adminClient.get(`/admin/users/${userId}`);
  },

  resetUserPassword: async (userId) => {
    return adminClient.post(`/admin/users/${userId}/reset-password`);
  },

  toggleUserBan: async (userId, banned) => {
    return adminClient.put(`/admin/users/${userId}/ban`, { banned });
  },

  // Books Management
  getAllBooks: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.category) queryParams.append('category', filters.category);
    const queryString = queryParams.toString();
    return adminClient.get(`/admin/books${queryString ? `?${queryString}` : ''}`);
  },

  createBook: async (bookData) => {
    return adminClient.post('/books', bookData);
  },

  updateBook: async (bookId, bookData) => {
    return adminClient.put(`/books/${bookId}`, bookData);
  },

  deleteBook: async (bookId) => {
    return adminClient.delete(`/books/${bookId}`);
  },
};

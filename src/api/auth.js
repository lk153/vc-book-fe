import { apiClient } from './apiClient';

// Authentication API
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    return apiClient.post('/auth/register', userData);
  },

  // Login user
  login: async (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  // Logout user
  logout: async () => {
    return apiClient.post('/auth/logout', {});
  },

  // Get current user profile
  getProfile: async () => {
    return apiClient.get('/auth/profile');
  },

  // Update user profile
  updateProfile: async (userData) => {
    return apiClient.put('/auth/profile', userData);
  },

  // Change password
  changePassword: async (passwordData) => {
    return apiClient.post('/auth/change-password', passwordData);
  },

  // Forgot Password - Request reset link
  forgotPassword: async (email) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  // Verify Reset Token
  verifyResetToken: async (token) => {
    return apiClient.post('/auth/verify-reset-token', { token });
  },

  // Reset Password - Set new password with token
  resetPassword: async (resetData) => {
    return apiClient.post('/auth/reset-password', resetData);
  },
};

// Token Management
export const tokenManager = {
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  removeToken: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// User Management
export const userManager = {
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  removeUser: () => {
    localStorage.removeItem('user');
  },

  getUserId: () => {
    const user = userManager.getUser();
    return user ? user.id || user._id : null;
  },
};

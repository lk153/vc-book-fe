const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

// Store auth error callback globally
let onAuthError = null;

export const setAuthErrorHandler = (handler) => {
  onAuthError = handler;
};

// Utility function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // Check for 401 errors
    if (response.status === 401 && onAuthError) {
      onAuthError();
    }
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API client with common methods
export const apiClient = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    return handleResponse(response);
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
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
        ...getAuthHeader(),
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
        ...getAuthHeader(),
      },
    });
    return handleResponse(response);
  },
};

export { API_BASE_URL };

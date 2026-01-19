import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { authAPI, tokenManager, userManager } from '../api/auth';
import { setAuthErrorHandler } from '../api/apiClient';
import { useTranslation } from '../i18n/LanguageContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { t } = useTranslation();
  const tRef = useRef(t);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  // Logout function
  const logout = useCallback(() => {
    tokenManager.removeToken();
    userManager.removeUser();
    setUser(null);
    toast.info(tRef.current('toast.loggedOut'));
  }, []);

  // Set up 401 error handler
  useEffect(() => {
    setAuthErrorHandler(() => {
      toast.error(tRef.current('auth.sessionExpired'));
      logout();
    });
  }, [logout]);

  // Initialize user from localStorage
  useEffect(() => {
    const savedUser = userManager.getUser();
    if (savedUser && tokenManager.isAuthenticated()) {
      setUser(savedUser);
    }
    setIsInitialized(true);
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await authAPI.login(credentials);

      if (response.token) {
        tokenManager.setToken(response.token);
      }

      const userData = response.user || response.data;
      if (userData) {
        userManager.setUser(userData);
        setUser(userData);
      }

      toast.success(t('auth.welcomeBack'));
      return userData;
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Register function
  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(userData);

      if (response.token) {
        tokenManager.setToken(response.token);
      }

      const user = response.user || response.data;
      if (user) {
        userManager.setUser(user);
        setUser(user);
      }

      toast.success(t('auth.accountCreated'));
      return user;
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Update user
  const updateUser = useCallback((userData) => {
    const updatedUser = { ...user, ...userData };
    userManager.setUser(updatedUser);
    setUser(updatedUser);
  }, [user]);

  const value = {
    user,
    isAuthenticated: !!user,
    isInitialized,
    loading,
    login,
    register,
    logout,
    updateUser,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { adminAPI, adminTokenManager, adminUserManager, setAdminAuthErrorHandler } from '../api/admin';
import { useTranslation } from '../i18n/LanguageContext';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const { t } = useTranslation();
  const tRef = useRef(t);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const [admin, setAdmin] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  // Logout function
  const logout = useCallback(() => {
    adminTokenManager.removeToken();
    adminUserManager.removeAdmin();
    setAdmin(null);
    toast.info(tRef.current('admin.auth.loggedOut'));
  }, []);

  // Set up 401 error handler for admin
  useEffect(() => {
    setAdminAuthErrorHandler(() => {
      toast.error(tRef.current('admin.auth.sessionExpired'));
      logout();
    });
  }, [logout]);

  // Initialize admin from localStorage
  useEffect(() => {
    const savedAdmin = adminUserManager.getAdmin();
    const token = adminTokenManager.getToken();
    if (savedAdmin && token) {
      setAdmin(savedAdmin);
    }
    setIsInitialized(true);
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await adminAPI.login(credentials);

      if (response.token) {
        adminTokenManager.setToken(response.token);
      }

      const adminData = response.admin || response.data;
      if (adminData) {
        adminUserManager.setAdmin(adminData);
        setAdmin(adminData);
      }

      toast.success(t('admin.auth.welcomeBack'));
      return adminData;
    } finally {
      setLoading(false);
    }
  }, [t]);

  const value = {
    admin,
    isAuthenticated: !!admin,
    isInitialized,
    loading,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

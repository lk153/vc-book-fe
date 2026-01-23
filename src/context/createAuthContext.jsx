import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from '../i18n/LanguageContext';

/**
 * Factory function to create authentication context with shared logic
 *
 * @param {Object} config - Configuration object
 * @param {string} config.contextName - Name for error messages (e.g., 'Auth', 'AdminAuth')
 * @param {Object} config.api - API object with login (and optionally register) methods
 * @param {Object} config.tokenManager - Token manager with getToken, setToken, removeToken, isAuthenticated
 * @param {Object} config.userManager - User manager with getUser, setUser, removeUser
 * @param {Function} config.setErrorHandler - Function to set 401 error handler
 * @param {Object} config.messages - Translation keys for toast messages
 * @param {string} config.messages.loggedOut - Key for logged out message
 * @param {string} config.messages.sessionExpired - Key for session expired message
 * @param {string} config.messages.welcomeBack - Key for welcome back message
 * @param {string} [config.messages.accountCreated] - Key for account created message (if register supported)
 * @param {string} config.userField - Field name in API response containing user data (e.g., 'user', 'admin')
 * @param {string} [config.exportUserAs='user'] - Property name for user in context value (e.g., 'user', 'admin')
 * @param {Object} [config.features] - Optional features to enable
 * @param {boolean} [config.features.register=false] - Enable register function
 * @param {boolean} [config.features.updateUser=false] - Enable updateUser function
 *
 * @returns {Object} { Provider, useAuth }
 */
export function createAuthContext(config) {
  const {
    contextName,
    api,
    tokenManager,
    userManager,
    setErrorHandler,
    messages,
    userField = 'user',
    exportUserAs = 'user',
    features = {},
  } = config;

  const Context = createContext(null);

  function Provider({ children }) {
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
      toast.info(tRef.current(messages.loggedOut));
    }, []);

    // Set up 401 error handler
    useEffect(() => {
      if (setErrorHandler) {
        setErrorHandler(() => {
          toast.error(tRef.current(messages.sessionExpired));
          logout();
        });
      }
    }, [logout]);

    // Initialize user from localStorage
    useEffect(() => {
      const savedUser = userManager.getUser();
      const hasToken = tokenManager.isAuthenticated
        ? tokenManager.isAuthenticated()
        : !!tokenManager.getToken();

      if (savedUser && hasToken) {
        setUser(savedUser);
      }
      setIsInitialized(true);
    }, []);

    // Login function
    const login = useCallback(async (credentials) => {
      setLoading(true);
      try {
        const response = await api.login(credentials);

        if (response.token) {
          tokenManager.setToken(response.token);
        }

        const userData = response[userField] || response.data;
        if (userData) {
          userManager.setUser(userData);
          setUser(userData);
        }

        toast.success(t(messages.welcomeBack));
        return userData;
      } finally {
        setLoading(false);
      }
    }, [t]);

    // Register function (optional)
    const register = useCallback(async (userData) => {
      if (!features.register || !api.register) {
        throw new Error(`Register is not supported in ${contextName}Context`);
      }

      setLoading(true);
      try {
        const response = await api.register(userData);

        if (response.token) {
          tokenManager.setToken(response.token);
        }

        const newUser = response[userField] || response.data;
        if (newUser) {
          userManager.setUser(newUser);
          setUser(newUser);
        }

        if (messages.accountCreated) {
          toast.success(t(messages.accountCreated));
        }
        return newUser;
      } finally {
        setLoading(false);
      }
    }, [t]);

    // Update user function (optional)
    const updateUser = useCallback((userData) => {
      if (!features.updateUser) {
        throw new Error(`UpdateUser is not supported in ${contextName}Context`);
      }

      const updatedUser = { ...user, ...userData };
      userManager.setUser(updatedUser);
      setUser(updatedUser);
    }, [user]);

    // Build value object based on enabled features
    const value = {
      [exportUserAs]: user,
      isAuthenticated: !!user,
      isInitialized,
      loading,
      login,
      logout,
      setUser,
    };

    if (features.register) {
      value.register = register;
    }

    if (features.updateUser) {
      value.updateUser = updateUser;
    }

    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    );
  }

  function useAuth() {
    const context = useContext(Context);
    if (!context) {
      throw new Error(`use${contextName} must be used within a ${contextName}Provider`);
    }
    return context;
  }

  return { Provider, useAuth };
}

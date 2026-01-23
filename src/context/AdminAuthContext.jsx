import { adminAPI, adminTokenManager, adminUserManager, setAdminAuthErrorHandler } from '../api/admin';
import { createAuthContext } from './createAuthContext';

// Adapter to normalize adminUserManager interface to match userManager
const adminUserManagerAdapter = {
  getUser: adminUserManager.getAdmin,
  setUser: adminUserManager.setAdmin,
  removeUser: adminUserManager.removeAdmin,
};

const { Provider: AdminAuthProvider, useAuth: useAdminAuth } = createAuthContext({
  contextName: 'AdminAuth',
  api: {
    login: adminAPI.login,
  },
  tokenManager: adminTokenManager,
  userManager: adminUserManagerAdapter,
  setErrorHandler: setAdminAuthErrorHandler,
  messages: {
    loggedOut: 'admin.auth.loggedOut',
    sessionExpired: 'admin.auth.sessionExpired',
    welcomeBack: 'admin.auth.welcomeBack',
  },
  userField: 'admin',
  exportUserAs: 'admin',
  features: {
    register: false,
    updateUser: false,
  },
});

export { AdminAuthProvider, useAdminAuth };

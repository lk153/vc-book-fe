import { authAPI, tokenManager, userManager } from '../api/auth';
import { setAuthErrorHandler } from '../api/apiClient';
import { createAuthContext } from './createAuthContext';

const { Provider: AuthProvider, useAuth } = createAuthContext({
  contextName: 'Auth',
  api: {
    login: authAPI.login,
    register: authAPI.register,
  },
  tokenManager,
  userManager,
  setErrorHandler: setAuthErrorHandler,
  messages: {
    loggedOut: 'toast.loggedOut',
    sessionExpired: 'auth.sessionExpired',
    welcomeBack: 'auth.welcomeBack',
    accountCreated: 'auth.accountCreated',
  },
  userField: 'user',
  features: {
    register: true,
    updateUser: true,
  },
});

export { AuthProvider, useAuth };

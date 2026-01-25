import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { BookOpen, User, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../../i18n/LanguageContext';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export function AdminLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loading, isAuthenticated, isInitialized } = useAdminAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);

  // If already authenticated, redirect to dashboard
  if (isInitialized && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.username || !formData.password) {
      setError(t('admin.auth.invalidCredentials'));
      return;
    }

    try {
      await login(formData);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || t('admin.auth.invalidCredentials'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-700 via-brown-600 to-brown-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl mb-4 shadow-gold-glow">
            <BookOpen className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gold-400 font-serif text-gold-glow">{t('admin.auth.login')}</h1>
          <p className="text-gold-300/70 mt-2">{t('admin.title')}</p>
        </div>

        {/* Login Form */}
        <div className="bg-ivory-50 rounded-2xl shadow-xl p-8 border border-gold-200/50">
          {error && (
            <div className="mb-6 p-4 bg-crimson-50 border border-crimson-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-crimson-400 flex-shrink-0" size={20} />
              <p className="text-crimson-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                {t('admin.auth.username')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" size={20} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition bg-ivory-100"
                  placeholder="admin"
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                {t('admin.auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition bg-ivory-100"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white py-3 px-4 rounded-lg font-medium hover:from-gold-600 hover:to-gold-700 focus:ring-4 focus:ring-gold-200 transition disabled:bg-brown-300 disabled:cursor-not-allowed shadow-gold-soft"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {t('admin.auth.loggingIn')}
                </>
              ) : (
                t('admin.auth.loginButton')
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gold-400/70 text-sm mt-6">
          {t('admin.title')} &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

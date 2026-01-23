import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BookOpen, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useForm } from '../../hooks/useForm';

export function LoginPage() {
  const { t } = useTranslation();
  const { login, loading } = useAuth();
  const { migrateGuestCart } = useCart();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const validateLogin = (values) => {
    const errors = {};

    if (!values.email || !values.password) {
      errors.form = t('validation.fillAllFields');
      return errors;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      errors.email = t('validation.emailInvalid');
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };

  const handleLogin = async (values) => {
    try {
      const userData = await login({
        email: values.email,
        password: values.password,
      });

      // Migrate guest cart to user cart
      if (userData) {
        const userId = userData.id || userData._id;
        await migrateGuestCart(userId);
      }

      navigate('/');
    } catch (err) {
      const errorMsg = err.message || t('auth.invalidCredentials');
      toast.error(errorMsg);
      throw err; // Re-throw to let useForm handle the error state
    }
  };

  const {
    values,
    error,
    handleChange,
    handleSubmit,
  } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: validateLogin,
    onSubmit: handleLogin,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-4xl font-bold text-blue-600 mb-2">
            <BookOpen size={40} />
            <span>{t('nav.title')}</span>
          </div>
          <p className="text-gray-600">{t('auth.signIn')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder={t('auth.enterEmail')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder={t('auth.enterPassword')}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">{t('auth.rememberMe')}</span>
              </label>
              <Link to="/forgot-password">{t('auth.forgotPassword')}</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  {t('auth.signingIn')}
                </>
              ) : (
                <>{t('auth.signInCta')}</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 my-6">
            {t('auth.noAccount')}{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('auth.signUp')}
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            {t('nav.continueAsGuest')} →
          </Link>
        </div>
      </div>
    </div>
  );
}

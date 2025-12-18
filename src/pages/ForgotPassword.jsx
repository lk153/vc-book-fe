import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BookOpen, Mail, ArrowLeft, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/authAPI';
import { useTranslation } from '../i18n/LanguageContext';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail()) {
      return;
    }

    try {
      setLoading(true);

      // Call forgot password API
      await authAPI.forgotPassword(email);

      // Show success state
      setSuccess(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (err) {
      const errorMsg = err.message || 'Failed to send reset email. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Success state - Email sent
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 text-4xl font-bold text-blue-600 mb-2">
              <BookOpen size={40} />
              <span>BookStore</span>
            </div>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={48} />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">{t('auth.forgotPassCheckEmail')}</h2>
            <p className="text-gray-600 mb-6">
              {t('auth.forgotPassCheckEmailDesc')}
            </p>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Mail className="text-blue-600" size={20} />
                <span className="font-semibold text-blue-800">{email}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-700 mb-2">
                <strong>{t('auth.forgotNextSteps')}</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>{t('auth.forgotStep1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>{t('auth.forgotStep2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>{t('auth.forgotStep3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>{t('auth.forgotStep4')}</span>
                </li>
              </ul>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              {t('auth.checkSpamNote')}{' '}
              <button
                onClick={() => setSuccess(false)}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                {t('auth.checkSpamTryAgain')}
              </button>
            </p>

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              {t('auth.backToLogin')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Request form - Default state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Login</span>
        </button>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-4xl font-bold text-blue-600 mb-2">
            <BookOpen size={40} />
            <span>BookStore</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-2">{t('auth.forgotPassword')}</h1>
          <p className="text-gray-600">
            {t('auth.forgotPasswordNote')}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder={t('auth.enterEmail')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  disabled={loading}
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {t('auth.enterEmailNote')}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  {t('common.sending')}
                </>
              ) : (
                <>{t('auth.sendResetLink')}</>
              )}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong className="text-blue-700">💡 Tip:</strong>
              </p>
              <p className="text-xs text-gray-600">
                {t('auth.resetPasswordTip')}
              </p>
            </div>
          </div>

          {/* Remember Password Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            {t('auth.rememberYourPassword')}{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('auth.signInCta')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
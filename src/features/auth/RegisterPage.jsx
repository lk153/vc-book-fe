import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BookOpen, Mail, Lock, User, Phone, Loader2, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export function RegisterPage() {
  const { t } = useTranslation();
  const { register, loading } = useAuth();
  const { migrateGuestCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(t('validation.fillRequired'));
      return false;
    }

    if (formData.fullName.trim().length < 2) {
      setError(t('validation.nameMin'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('validation.emailInvalid'));
      return false;
    }

    if (formData.phone) {
      const phoneRegex = /^[\d\s\-+()]+$/;
      if (!phoneRegex.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
        setError(t('validation.phoneInvalid'));
        return false;
      }
    }

    if (formData.password.length < 6) {
      setError(t('validation.passwordMin', { min: 6 }));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('validation.passwordMatch'));
      return false;
    }

    if (!acceptTerms) {
      setError(t('validation.termsRequired'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      toast.error(error);
      return;
    }

    try {
      const userData = await register({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      // Migrate guest cart to user cart
      if (userData) {
        const userId = userData.id || userData._id;
        await migrateGuestCart(userId);
      }

      navigate('/');
    } catch (err) {
      const errorMsg = err.message || t('auth.accountCreateFailed');
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-100 via-ivory-50 to-ivory-200 flex items-center justify-center p-4 bg-chinese-pattern">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-4xl font-bold text-gold-600 text-gold-glow mb-2 font-serif">
            <BookOpen size={40} />
            <span>{t('nav.title')}</span>
          </div>
          <p className="text-brown-600">{t('auth.create_account')}</p>
        </div>

        <div className="bg-ivory-50 rounded-2xl shadow-xl p-8 border border-gold-200/50">
          {error && (
            <div className="mb-6 p-4 bg-crimson-50 border border-crimson-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-crimson-400 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-crimson-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-brown-700 mb-2">
                {t('auth.fullName')} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" size={20} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={t('auth.enterFullName')}
                  className="w-full pl-10 pr-4 py-3 border border-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 bg-ivory-100 focus:border-transparent transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-brown-700 mb-2">
                {t('auth.email')} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('auth.enterEmail')}
                  className="w-full pl-10 pr-4 py-3 border border-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 bg-ivory-100 focus:border-transparent transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-brown-700 mb-2">
                {t('auth.phone')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t('auth.enterPhone')}
                  className="w-full pl-10 pr-4 py-3 border border-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 bg-ivory-100 focus:border-transparent transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-brown-700 mb-2">
                {t('auth.password')} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t('auth.enterPassword')}
                  className="w-full pl-10 pr-12 py-3 border border-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 bg-ivory-100 focus:border-transparent transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold-500 hover:text-gold-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-gold-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-brown-600">{passwordStrength.label}</span>
                  </div>
                  <p className="text-xs text-brown-500">Use at least 6 characters with letters and numbers</p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-brown-700 mb-2">
                {t('auth.confirmPassword')} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder={t('auth.enterConfirmPassword')}
                  className="w-full pl-10 pr-12 py-3 border border-gold-300 rounded-lg focus:ring-2 focus:ring-gold-500 bg-ivory-100 focus:border-transparent transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold-500 hover:text-gold-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                  <CheckCircle size={16} />
                  <span>Passwords match</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 text-gold-600 border-gold-300 rounded focus:ring-gold-500 mt-1"
                />
                <span className="text-sm text-brown-600">
                  {t('auth.acceptTerms')}{' '}
                  <button
                    type="button"
                    onClick={() => toast.info('Terms and Conditions page coming soon!')}
                    className="text-gold-600 hover:text-gold-700 font-medium"
                  >
                    {t('auth.termsConditions')}
                  </button>
                  {' '}{t('auth.and')}{' '}
                  <button
                    type="button"
                    onClick={() => toast.info('Privacy Policy page coming soon!')}
                    className="text-gold-600 hover:text-gold-700 font-medium"
                  >
                    {t('auth.privacyPolicy')}
                  </button>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-3 rounded-lg font-bold text-lg hover:from-gold-600 hover:to-gold-700 transition disabled:bg-brown-300 disabled:cursor-not-allowed flex items-center justify-center shadow-gold-soft"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Creating account...
                </>
              ) : (
                t('auth.createAccount')
              )}
            </button>
          </form>

          <p className="text-center text-sm text-brown-600 mt-6">
            {t('auth.haveAccount')}{' '}
            <Link
              to="/login"
              className="text-gold-600 hover:text-gold-700 font-medium"
            >
              {t('auth.signInCta')}
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-brown-600 hover:text-gray-800 text-sm font-medium"
          >
            {t('auth.continueAsGuest')} →
          </Link>
        </div>
      </div>
    </div>
  );
}

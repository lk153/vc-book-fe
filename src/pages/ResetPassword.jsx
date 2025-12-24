import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BookOpen, Lock, Eye, EyeOff, CheckCircle, Loader2, AlertCircle, Shield } from 'lucide-react';
import { authAPI } from '../services/authAPI';
import { useTranslation } from '../i18n/LanguageContext';

export default function ResetPassword() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Get reset token from URL

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);

    // Validate token on mount
    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            setError('Invalid or missing reset token');
        } else {
            // Optionally verify token with backend
            verifyToken(token);
        }
    }, [token]);

    const verifyToken = async (resetToken) => {
        try {
            // Optional: Call backend to verify token is valid
            await authAPI.verifyResetToken(resetToken);
            setTokenValid(true);
        } catch (err) {
            setTokenValid(false);
            setError('This reset link is invalid or has expired');
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

    const validateForm = () => {
        if (!formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            // Call reset password API
            await authAPI.resetPassword({
                token: token,
                password: formData.password,
            });

            setSuccess(true);
            toast.success(t('resetPassSuccess.toastMessage'));
        } catch (err) {
            const errorMsg = err.message || 'Failed to reset password. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError(null);
    };

    const passwordStrength = getPasswordStrength();

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 text-4xl font-bold text-blue-600 mb-2">
                            <BookOpen size={40} />
                            <span>BookStore</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-green-600" size={48} />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-3">{t('resetPassSuccess.title')}</h2>
                        <p className="text-gray-600 mb-6">
                            {t('resetPassSuccess.description')}
                        </p>

                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mb-4"
                        >
                            {t('resetPassSuccess.backToLogin')}
                        </button>

                        <Link
                            to="/"
                            className="text-sm text-gray-600 hover:text-gray-800"
                        >
                            {t('resetPassSuccess.backToHome')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Invalid token state
    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 text-4xl font-bold text-blue-600 mb-2">
                            <BookOpen size={40} />
                            <span>BookStore</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="text-red-600" size={48} />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-3">{t('resetPassSuccess.invalidResetLink')}</h2>
                        <p className="text-gray-600 mb-6">
                            {error || 'This password reset link is invalid or has expired. Please request a new one.'}
                        </p>

                        <button
                            onClick={() => navigate('/forgot-password')}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mb-4"
                        >
                            {t('resetPassSuccess.requestNewLink')}
                        </button>

                        <Link
                            to="/login"
                            className="text-sm text-gray-600 hover:text-gray-800"
                        >
                            {t('resetPassSuccess.backToLogin')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Reset form
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 text-4xl font-bold text-blue-600 mb-2">
                        <BookOpen size={40} />
                        <span>BookStore</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-2">{t('resetPass.title')}</h1>
                    <p className="text-gray-600">
                        {t('resetPass.description')}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* New Password */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('resetPass.inputNewPassword')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder={t('resetPass.inputNewPasswordPlaceholder')}
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

                            {/* Password Strength */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                                                style={{ width: `${passwordStrength.strength}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-600">{passwordStrength.label}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{t('resetPassSuccess.passwordStrength')}</p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('resetPass.inputConfirmPassword')}
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder={t('resetPass.inputConfirmPasswordPlaceholder')}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                                    <CheckCircle size={16} />
                                    <span>{t('resetPassSuccess.passwordMatch')}</span>
                                </div>
                            )}
                        </div>

                        {/* Security Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="text-sm font-medium text-blue-900 mb-1">{t('resetPass.securityTipTitle')}</p>
                                    <ul className="text-xs text-blue-700 space-y-1">
                                        <li>{t('resetPass.securityTip1')}</li>
                                        <li>{t('resetPass.securityTip2')}</li>
                                        <li>{t('resetPass.securityTip3')}</li>
                                    </ul>
                                </div>
                            </div>
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
                                    {t('resetPass.resetting')}
                                </>
                            ) : (
                                t('resetPass.resetPassword')
                            )}
                        </button>
                    </form>

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
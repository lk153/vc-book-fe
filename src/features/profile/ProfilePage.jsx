import { useState } from 'react';
import { toast } from 'react-toastify';
import { User, Mail, Phone, Lock, Save, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { authAPI } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Navigation } from '../../components/Navigation';

export function ProfilePage() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || user?.fullName || '',
    phone: user?.phone || '',
  });

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name) {
      const msg = 'Name is required';
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      setLoading(true);
      await authAPI.updateProfile(formData);
      updateUser(formData);
      toast.success(t('profile.updated'));
      setIsEditing(false);
    } catch (err) {
      const msg = err.message || t('profile.updateFailed');
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      const msg = t('profile.allFieldsRequired');
      setError(msg);
      toast.error(msg);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      const msg = t('profile.passwordMinLength');
      setError(msg);
      toast.error(msg);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      const msg = t('profile.passwordsNotMatch');
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      setLoading(true);
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success(t('profile.passwordChanged'));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordSection(false);
    } catch (err) {
      const msg = err.message || t('profile.passwordFailed');
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    const name = user?.name || user?.fullName || user?.email || 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation showBackButton={true} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">{t('profile.title')}</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl mb-4">
                {getUserInitials()}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {user?.name || user?.fullName || 'User'}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{user?.email}</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {isEditing ? t('profile.cancelEdit') : t('profile.editProfile')}
                </button>
                <button
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  {t('profile.changePassword')}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">{t('profile.information')}</h3>

              <form onSubmit={handleUpdateProfile}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.fullName')} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing || loading}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <div className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {user?.email}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.phone')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing || loading}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {isEditing && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        {t('profile.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" size={20} />
                        {t('profile.saveChanges')}
                      </>
                    )}
                  </button>
                )}
              </form>

              {showPasswordSection && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Lock size={24} className="text-gray-600" />
                    {t('profile.changePassword')}
                  </h3>

                  <form onSubmit={handleChangePassword}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('profile.currentPassword')} *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          disabled={loading}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('profile.newPassword')} *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          disabled={loading}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('profile.confirmPassword')} *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          disabled={loading}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={20} />
                          {t('profile.changingPassword')}...
                        </>
                      ) : (
                        t('profile.changePassword')
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

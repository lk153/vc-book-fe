import { useState } from 'react';
import { toast } from 'react-toastify';
import { Ban, CheckCircle, Key, RefreshCw } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { DataTable } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { useAdminUsers, useToggleUserBan, useResetUserPassword } from '../hooks/useAdminUsers';
import { useTranslation, useLanguage } from '../../../i18n/LanguageContext';
import { getId } from '../../../utils/getId';

export function AdminUsersPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [filters] = useState({ page: 1, limit: 10 });

  const { users, isLoading, refetch } = useAdminUsers(filters);
  const toggleBan = useToggleUserBan();
  const resetPassword = useResetUserPassword();

  const handleToggleBan = async (userId, currentBanned) => {
    const confirmMessage = currentBanned
      ? t('admin.users.confirmUnban')
      : t('admin.users.confirmBan');

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await toggleBan.mutateAsync({ userId, banned: !currentBanned });
      toast.success(currentBanned ? t('admin.users.unbanned') : t('admin.users.banned'));
    } catch (error) {
      toast.error(error.message || t('admin.users.actionFailed'));
    }
  };

  const handleResetPassword = async (userId, userEmail) => {
    if (!window.confirm(t('admin.users.confirmResetPassword'))) {
      return;
    }

    try {
      await resetPassword.mutateAsync(userId);
      toast.success(t('admin.users.passwordResetSent'));
    } catch (error) {
      toast.error(error.message || t('admin.users.actionFailed'));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAvailable');
    const date = new Date(dateString);
    const locale = language === 'vi' ? 'vi-VN' : 'en-US';
    return date.toLocaleDateString(locale);
  };

  const columns = [
    {
      key: 'name',
      label: t('admin.users.name'),
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {(row.name || row.fullName || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium">{row.name || row.fullName || t('common.notAvailable')}</span>
        </div>
      )
    },
    {
      key: 'email',
      label: t('admin.users.email'),
    },
    {
      key: 'phone',
      label: t('admin.users.phone'),
      render: (row) => row.phone || t('common.notAvailable')
    },
    {
      key: 'createdAt',
      label: t('admin.users.joinedDate'),
      render: (row) => formatDate(row.createdAt)
    },
    {
      key: 'status',
      label: t('admin.users.status'),
      render: (row) => (
        <StatusBadge
          status={row.banned ? 'banned' : 'active'}
          type="user"
        />
      )
    },
    {
      key: 'actions',
      label: t('admin.common.actions'),
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleResetPassword(getId(row), row.email);
            }}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
            title={t('admin.users.resetPassword')}
          >
            <Key size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleBan(getId(row), row.banned);
            }}
            className={`p-2 rounded-lg transition ${
              row.banned
                ? 'text-green-600 hover:bg-green-50'
                : 'text-red-600 hover:bg-red-50'
            }`}
            title={row.banned ? t('admin.users.unban') : t('admin.users.ban')}
          >
            {row.banned ? <CheckCircle size={18} /> : <Ban size={18} />}
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('admin.users.title')}</h1>
          <p className="text-gray-600 mt-1">{t('admin.users.subtitle')}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw size={18} />
          {t('admin.common.refresh')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          emptyMessage={t('admin.users.noUsers')}
        />
      </div>
    </AdminLayout>
  );
}

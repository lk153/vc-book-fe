import { useQuery } from '@tanstack/react-query';
import { Package, Users, BookOpen, DollarSign, Loader2 } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { StatsCard } from '../components/StatsCard';
import { useTranslation } from '../../../i18n/LanguageContext';
import { adminAPI } from '../../../api/admin';
import { formatPrice } from '../../../utils/price';

export function AdminDashboardPage() {
  const { t } = useTranslation();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: adminAPI.getDashboardStats,
    staleTime: 1000 * 60 * 5,
  });

  const dashboardStats = stats?.data || stats || {};

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{t('admin.dashboard.title')}</h1>
        <p className="text-gray-600 mt-1">{t('admin.dashboard.subtitle')}</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title={t('admin.dashboard.totalOrders')}
            value={dashboardStats.totalOrders || 0}
            icon={Package}
            color="blue"
          />
          <StatsCard
            title={t('admin.dashboard.totalUsers')}
            value={dashboardStats.totalUsers || 0}
            icon={Users}
            color="green"
          />
          <StatsCard
            title={t('admin.dashboard.totalBooks')}
            value={dashboardStats.totalBooks || 0}
            icon={BookOpen}
            color="purple"
          />
          <StatsCard
            title={t('admin.dashboard.totalRevenue')}
            value={`${formatPrice(dashboardStats.totalRevenue || 0)}₫`}
            icon={DollarSign}
            color="yellow"
          />
        </div>
      )}
    </AdminLayout>
  );
}

import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  BookOpen,
  FolderTree,
  LogOut,
  Home
} from 'lucide-react';
import { useTranslation } from '../../../i18n/LanguageContext';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export function AdminSidebar() {
  const { t } = useTranslation();
  const { logout, admin } = useAdminAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: t('admin.nav.dashboard') },
    { path: '/admin/orders', icon: Package, label: t('admin.nav.orders') },
    { path: '/admin/users', icon: Users, label: t('admin.nav.users') },
    { path: '/admin/books', icon: BookOpen, label: t('admin.nav.books') },
    { path: '/admin/categories', icon: FolderTree, label: t('admin.nav.categories') },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="text-blue-600" />
          {t('admin.title')}
        </h1>
        {admin && (
          <p className="text-sm text-gray-500 mt-1">
            {admin.username || admin.name}
          </p>
        )}
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition ${
              isActive(item.path)
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition mb-2"
        >
          <Home size={20} />
          <span className="font-medium">{t('admin.nav.backToStore')}</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={20} />
          <span className="font-medium">{t('admin.nav.logout')}</span>
        </button>
      </div>
    </aside>
  );
}

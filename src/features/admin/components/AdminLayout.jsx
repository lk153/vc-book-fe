import { AdminSidebar } from './AdminSidebar';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function AdminLayout({ children }) {
  const { admin, isInitialized } = useAdminAuth();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

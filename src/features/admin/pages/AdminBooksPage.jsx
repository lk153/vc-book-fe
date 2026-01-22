import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { DataTable } from '../components/DataTable';
import { useAdminBooks, useDeleteBook } from '../hooks/useAdminBooks';
import { useTranslation } from '../../../i18n/LanguageContext';
import { formatPrice } from '../../../utils/price';
import { getId } from '../../../utils/getId';
import { ROUTES, getAdminBookEditPath } from '../../../constants/routes';

export function AdminBooksPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filters] = useState({ page: 1, limit: 10 });

  const { books, isLoading, refetch } = useAdminBooks(filters);
  const deleteBook = useDeleteBook();

  const handleDelete = async (bookId, bookTitle) => {
    if (!window.confirm(t('admin.books.confirmDelete'))) {
      return;
    }

    try {
      await deleteBook.mutateAsync(bookId);
      toast.success(t('admin.books.deleted'));
    } catch (error) {
      toast.error(error.message || t('admin.books.deleteFailed'));
    }
  };

  const columns = [
    {
      key: 'image',
      label: t('admin.books.image'),
      render: (row) => (
        <img
          src={row.coverImage || row.image}
          alt={row.title}
          className="w-12 h-16 object-cover rounded"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop';
          }}
        />
      )
    },
    {
      key: 'title',
      label: t('admin.books.title'),
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">{row.title}</p>
          <p className="text-sm text-gray-500">{row.category}</p>
        </div>
      )
    },
    {
      key: 'author',
      label: t('admin.books.author'),
    },
    {
      key: 'price',
      label: t('admin.books.price'),
      render: (row) => (
        <span className="font-semibold">{formatPrice(row.price)}₫</span>
      )
    },
    {
      key: 'stock',
      label: t('admin.books.stock'),
      render: (row) => (
        <span className={`font-medium ${row.stock === 0 ? 'text-red-600' : row.stock < 10 ? 'text-orange-600' : 'text-gray-700'}`}>
          {row.stock}
          {row.stock === 0 && (
            <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
              {t('admin.books.outOfStock')}
            </span>
          )}
          {row.stock > 0 && row.stock < 10 && (
            <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
              {t('admin.books.lowStock')}
            </span>
          )}
        </span>
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
              navigate(getAdminBookEditPath(getId(row)));
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title={t('admin.common.edit')}
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(getId(row), row.title);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title={t('admin.common.delete')}
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('admin.books.pageTitle')}</h1>
          <p className="text-gray-600 mt-1">{t('admin.books.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <RefreshCw size={18} />
            {t('admin.common.refresh')}
          </button>
          <button
            onClick={() => navigate(ROUTES.ADMIN_BOOKS_NEW)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            {t('admin.books.addBook')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={books}
          isLoading={isLoading}
          emptyMessage={t('admin.books.noBooks')}
        />
      </div>
    </AdminLayout>
  );
}

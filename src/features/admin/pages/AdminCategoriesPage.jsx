import { useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2, Loader2, X, FolderTree } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { DataTable } from '../components/DataTable';
import { useTranslation } from '../../../i18n/LanguageContext';
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../hooks/useAdminCategories';
import { getId } from '../../../utils/getId';

export function AdminCategoriesPage() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { categories, isLoading, refetch } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name || '', description: category.description || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(t('admin.categories.nameRequired'));
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          categoryId: getId(editingCategory),
          categoryData: formData,
        });
        toast.success(t('admin.categories.updated'));
      } else {
        await createCategory.mutateAsync(formData);
        toast.success(t('admin.categories.created'));
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || t('admin.categories.saveFailed'));
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await deleteCategory.mutateAsync(categoryId);
      toast.success(t('admin.categories.deleted'));
      setDeleteConfirm(null);
    } catch (error) {
      toast.error(error.message || t('admin.categories.deleteFailed'));
    }
  };

  const columns = [
    {
      key: 'name',
      label: t('admin.categories.name'),
      render: (row) => (
        <div className="flex items-center gap-2">
          <FolderTree size={18} className="text-blue-600" />
          <span className="font-medium text-gray-800">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: t('admin.categories.description'),
      render: (row) => (
        <span className="text-gray-600 text-sm">
          {row.description || '-'}
        </span>
      ),
    },
    {
      key: 'bookCount',
      label: t('admin.categories.bookCount'),
      render: (row) => (
        <span className="text-gray-600">
          {row.bookCount || row.booksCount || 0}
        </span>
      ),
    },
    {
      key: 'actions',
      label: t('admin.common.actions'),
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title={t('admin.common.edit')}
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => setDeleteConfirm(getId(row))}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title={t('admin.common.delete')}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('admin.categories.title')}</h1>
          <p className="text-gray-600 mt-1">{t('admin.categories.subtitle')}</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          {t('admin.categories.addCategory')}
        </button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        emptyMessage={t('admin.categories.noCategories')}
        onRefresh={refetch}
      />

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingCategory ? t('admin.categories.editCategory') : t('admin.categories.addCategory')}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.categories.name')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('admin.categories.namePlaceholder')}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.categories.description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('admin.categories.descriptionPlaceholder')}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  {t('admin.common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createCategory.isPending || updateCategory.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {(createCategory.isPending || updateCategory.isPending) && (
                    <Loader2 className="animate-spin" size={18} />
                  )}
                  {editingCategory ? t('admin.categories.updateCategory') : t('admin.categories.createCategory')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('admin.categories.confirmDelete')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('admin.categories.confirmDeleteMessage')}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                {t('admin.common.cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleteCategory.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-400"
              >
                {deleteCategory.isPending && <Loader2 className="animate-spin" size={18} />}
                {t('admin.common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

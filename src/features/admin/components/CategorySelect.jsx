import { Loader2 } from 'lucide-react';
import { useAdminCategories } from '../hooks/useAdminCategories';
import { getId } from '../../../utils/getId';

/**
 * Category selection dropdown for book form
 * @param {Object} props
 * @param {string} props.value - Currently selected category
 * @param {Function} props.onChange - Handler for selection changes
 * @param {Function} props.t - Translation function
 */
export function CategorySelect({ value, onChange, t }) {
  const { categories, isLoading } = useAdminCategories();

  if (isLoading) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('admin.books.category')}
        </label>
        <div className="w-full px-4 py-3 border border-gray-300 rounded-lg flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" size={18} />
          {t('admin.common.loading')}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('admin.books.category')}
      </label>
      <select
        name="category"
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">{t('admin.categories.selectCategory')}</option>
        {categories.map((cat) => (
          <option key={getId(cat)} value={cat.name}>{cat.name}</option>
        ))}
      </select>
    </div>
  );
}

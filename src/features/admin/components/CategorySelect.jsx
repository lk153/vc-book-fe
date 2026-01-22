import { CATEGORIES } from '../../../api/books';

/**
 * Category selection dropdown for book form
 * @param {Object} props
 * @param {string} props.value - Currently selected category
 * @param {Function} props.onChange - Handler for selection changes
 * @param {Function} props.t - Translation function
 */
export function CategorySelect({ value, onChange, t }) {
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
        {CATEGORIES.filter(c => c !== 'Tất cả').map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
}

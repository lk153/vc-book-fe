/**
 * Form section for pricing and stock information
 * @param {Object} props
 * @param {Object} props.formData - Form data object containing price and stock
 * @param {Function} props.onChange - Handler for input changes
 * @param {Function} props.t - Translation function
 */
export function PricingStockForm({ formData, onChange, t }) {
  return (
    <>
      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('admin.books.price')} (VND) *
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={onChange}
          min="0"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('admin.books.stock')} *
        </label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={onChange}
          min="0"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
    </>
  );
}

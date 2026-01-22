/**
 * Form section for basic book information (title, author, ISBN, publisher, pages)
 * @param {Object} props
 * @param {Object} props.formData - Form data object
 * @param {Function} props.onChange - Handler for input changes
 * @param {Function} props.t - Translation function
 */
export function BookBasicInfoForm({ formData, onChange, t }) {
  return (
    <>
      {/* Title */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('admin.books.title')} *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Author */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('admin.books.author')} *
        </label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
    </>
  );
}

/**
 * Form section for additional book details (ISBN, publisher, pages)
 * @param {Object} props
 * @param {Object} props.formData - Form data object
 * @param {Function} props.onChange - Handler for input changes
 * @param {Function} props.t - Translation function
 */
export function BookDetailsForm({ formData, onChange, t }) {
  return (
    <>
      {/* ISBN */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('admin.books.isbn')}
        </label>
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Publisher */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('admin.books.publisher')}
        </label>
        <input
          type="text"
          name="publisher"
          value={formData.publisher}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Pages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('admin.books.pages')}
        </label>
        <input
          type="number"
          name="pages"
          value={formData.pages}
          onChange={onChange}
          min="0"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </>
  );
}

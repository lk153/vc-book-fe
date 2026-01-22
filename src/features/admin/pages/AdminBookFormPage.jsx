import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, Loader2, ArrowLeft, Image, ZoomIn } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { ImagePreviewModal } from '../components/ImagePreviewModal';
import { BookBasicInfoForm, BookDetailsForm } from '../components/BookBasicInfoForm';
import { CategorySelect } from '../components/CategorySelect';
import { PricingStockForm } from '../components/PricingStockForm';
import { useCreateBook, useUpdateBook } from '../hooks/useAdminBooks';
import { useBookDetail } from '../../books/useBooks';
import { useTranslation } from '../../../i18n/LanguageContext';
import { CATEGORIES } from '../../../api/books';
import { ROUTES } from '../../../constants/routes';

export function AdminBookFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookId } = useParams();
  const isEditing = !!bookId;

  const { book, isLoading: isLoadingBook } = useBookDetail(bookId);
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    stock: '',
    category: CATEGORIES[1] || '',
    coverImage: '',
    isbn: '',
    publisher: '',
    pages: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (book && isEditing) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        description: book.description || '',
        price: book.price || '',
        stock: book.stock || '',
        category: book.category || '',
        coverImage: book.coverImage || book.image || '',
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        pages: book.pages || '',
      });
      setImagePreview(book.coverImage || book.image || '');
    }
  }, [book, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'coverImage') {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.price || !formData.stock) {
      toast.error(t('admin.books.fillRequired'));
      return;
    }

    const bookData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      pages: formData.pages ? parseInt(formData.pages, 10) : undefined,
    };

    try {
      if (isEditing) {
        await updateBook.mutateAsync({ bookId, bookData });
        toast.success(t('admin.books.updated'));
      } else {
        await createBook.mutateAsync(bookData);
        toast.success(t('admin.books.created'));
      }
      navigate(ROUTES.ADMIN_BOOKS);
    } catch (error) {
      toast.error(error.message || t('admin.books.saveFailed'));
    }
  };

  const isSubmitting = createBook.isPending || updateBook.isPending;

  if (isEditing && isLoadingBook) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <button
          onClick={() => navigate(ROUTES.ADMIN_BOOKS)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} />
          {t('admin.books.backToList')}
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {isEditing ? t('admin.books.editBook') : t('admin.books.addBook')}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info: Title & Author */}
            <BookBasicInfoForm
              formData={formData}
              onChange={handleChange}
              t={t}
            />

            {/* Category */}
            <CategorySelect
              value={formData.category}
              onChange={handleChange}
              t={t}
            />

            {/* Pricing & Stock */}
            <PricingStockForm
              formData={formData}
              onChange={handleChange}
              t={t}
            />

            {/* Cover Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.books.coverImageUrl')}
              </label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {imagePreview && (
                <div className="mt-4 flex items-start gap-4">
                  <button
                    type="button"
                    onClick={() => setShowImageModal(true)}
                    className="relative group"
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-32 object-cover rounded-lg border transition group-hover:opacity-80"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <ZoomIn className="text-gray-700 bg-white rounded-full p-1" size={24} />
                    </div>
                  </button>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Image size={16} />
                    {t('admin.books.imagePreview')}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.books.description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Additional Details: ISBN, Publisher, Pages */}
            <BookDetailsForm
              formData={formData}
              onChange={handleChange}
              t={t}
            />
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_BOOKS)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              {t('admin.common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {t('admin.common.saving')}
                </>
              ) : (
                <>
                  <Save size={20} />
                  {isEditing ? t('admin.books.updateBook') : t('admin.books.createBook')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {showImageModal && imagePreview && (
        <ImagePreviewModal
          imageUrl={imagePreview}
          onClose={() => setShowImageModal(false)}
          t={t}
        />
      )}
    </AdminLayout>
  );
}

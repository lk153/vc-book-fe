import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Save, Loader2, ArrowLeft, Image, ZoomIn, ZoomOut, X } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useCreateBook, useUpdateBook } from '../hooks/useAdminBooks';
import { useBookDetail } from '../../books/useBooks';
import { useTranslation } from '../../../i18n/LanguageContext';
import { CATEGORIES } from '../../../api/books';

function ImagePreviewModal({ imageUrl, onClose, t }) {
  const [scale, setScale] = useState(1);
  const minScale = 0.5;
  const maxScale = 3;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, maxScale));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, minScale));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          disabled={scale <= minScale}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title={t('admin.books.zoomOut')}
        >
          <ZoomOut size={20} />
        </button>
        <span className="text-white font-medium min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          disabled={scale >= maxScale}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title={t('admin.books.zoomIn')}
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition ml-4"
          title={t('admin.common.cancel')}
        >
          <X size={20} />
        </button>
      </div>

      <div
        className="overflow-auto max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
      >
        <img
          src={imageUrl}
          alt="Preview"
          style={{ transform: `scale(${scale})`, transition: 'transform 0.2s ease' }}
          className="max-w-none cursor-grab"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop';
          }}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm opacity-70">
        {t('admin.books.zoomHint')}
      </div>
    </div>
  );
}

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
      navigate('/admin/books');
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
          onClick={() => navigate('/admin/books')}
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
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.books.title')} *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
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
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.books.category')}
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CATEGORIES.filter(c => c !== 'Tất cả').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.books.price')} (VND) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
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
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

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

            {/* ISBN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.books.isbn')}
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/books')}
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

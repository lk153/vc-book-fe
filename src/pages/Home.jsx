import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import CategoryFilter from '../components/CategoryFilter';
import BookCard from '../components/BookCard';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { booksAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function Home({
  cart,
  setSelectedBook,
  categories,
  user,
  onLogout,
  handle401Error,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    limit: 12,
  });

  const failedLoadBooksMessage = t('app.failedLoadBooks');

  useEffect(() => {
    let isMounted = true;

    const loadBooks = async () => {
      if (!isMounted) return;
      try {
        setLoading(true);
        setError(null);

        const response = await booksAPI.getAll({
          category: selectedCategory,
          page: pagination.currentPage,
          limit: pagination.limit,
        });

        if (!isMounted) return;
        setBooks(response.data || []);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            totalPages: response.pagination.totalPages || 1,
            totalBooks: response.pagination.totalBooks || 0,
          }));
        }
      } catch (err) {
        if (!isMounted) return;
        if (handle401Error && handle401Error(err)) return;
        setError(err.message || failedLoadBooksMessage);
        toast.error(`${failedLoadBooksMessage}: ${err.message}`);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBooks();

    return () => { isMounted = false; };
  }, [selectedCategory, pagination.currentPage, pagination.limit, failedLoadBooksMessage, handle401Error]);

  const goToBook = (id) => {
    navigate(`/book/${id}`);
  };

  const onPageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      onPageChange(pagination.currentPage + 1);
    }
  };

  const onPrevPage = () => {
    if (pagination.currentPage > 1) {
      onPageChange(pagination.currentPage - 1);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation cart={cart} user={user} onLogout={onLogout} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-700 mb-2">{t('home.errorLoading')}</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation cart={cart} user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">{t('home.title')}</h1>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <span className="ml-4 text-xl text-gray-600">{t('home.loadingBooks')}</span>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">{t('home.noBooks')}</p>
          </div>
        ) : (
          <>
            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {books.map(book => (
                <BookCard
                  key={book._id}
                  book={book}
                  onClick={() => {
                    setSelectedBook(book);
                    goToBook(book._id)
                  }}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-8 pb-8">
                {/* Page Info */}
                <div className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                  {pagination.totalBooks > 0 && ` (${pagination.totalBooks} books total)`}
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={onPrevPage}
                    disabled={pagination.currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft size={20} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-2">
                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNum = index + 1;

                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        Math.abs(pageNum - pagination.currentPage) <= 1;

                      // Show ellipsis
                      const showEllipsis =
                        (pageNum === 2 && pagination.currentPage > 3) ||
                        (pageNum === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 2);

                      if (showEllipsis) {
                        return (
                          <span key={pageNum} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => onPageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition ${pagination.currentPage === pageNum
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-blue-50 border-2 border-gray-300 hover:border-blue-500'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={onNextPage}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
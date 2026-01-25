import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useBooks } from './useBooks';
import { useCategories } from './useCategories';
import { BookCard } from './BookCard';
import { CategoryFilter } from './CategoryFilter';
import { Navigation } from '../../components/Navigation';
import { Pagination } from '../../components/Pagination';
import { getBookDetailPath } from '../../constants/routes';

export function BooksListingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(t('categories.all'));
  const [currentPage, setCurrentPage] = useState(1);

  const { categories: categoryData, isLoading: categoriesLoading } = useCategories();

  // Build categories array with "All" at the beginning
  const categories = useMemo(() => {
    const allCategory = { name: t('categories.all'), description: t('categories.allDescription') };
    return [allCategory, ...categoryData];
  }, [categoryData, t]);

  const { books, pagination, isLoading, error } = useBooks({
    category: selectedCategory === t('categories.all') ? '' : selectedCategory,
    page: currentPage,
    limit: 12,
  });

  const goToBook = (id) => {
    navigate(getBookDetailPath(id));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page when category changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory-100 via-ivory-50 to-ivory-200">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-crimson-50 border border-crimson-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-crimson-500 mb-2">{t('home.errorLoading')}</h2>
            <p className="text-crimson-400">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-crimson-400 text-white px-6 py-2 rounded-lg hover:bg-crimson-500 transition"
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-100 via-ivory-50 to-ivory-200 bg-chinese-pattern">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gold-600 text-gold-glow mb-8 font-serif">{t('home.title')}</h1>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
          isLoading={categoriesLoading}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-gold-500" size={48} />
            <span className="ml-4 text-xl text-brown-600">{t('home.loadingBooks')}</span>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-brown-600">{t('home.noBooks')}</p>
          </div>
        ) : (
          <>
            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {books.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => goToBook(book.id)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && (
              <div className="mt-8 pb-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  totalItems={pagination.totalBooks}
                  itemLabel={t('pagination.booksTotal')}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

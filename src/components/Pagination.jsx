import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

/**
 * Reusable Pagination component with ellipsis support
 * @param {Object} props
 * @param {number} props.currentPage - Current active page (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {function} props.onPageChange - Callback when page changes
 * @param {number} [props.siblingCount=1] - Number of siblings to show on each side of current page
 * @param {number} [props.totalItems] - Optional total items count for info display
 * @param {string} [props.itemLabel] - Optional label for items (e.g., "books", "orders")
 * @param {boolean} [props.showPageInfo=true] - Whether to show "Page X of Y" info
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  totalItems,
  itemLabel,
  showPageInfo = true,
}) {
  const { t } = useTranslation();

  // Don't render if only one page
  if (totalPages <= 1) return null;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      // Always show first page, last page, and pages around current
      const showPage =
        i === 1 ||
        i === totalPages ||
        Math.abs(i - currentPage) <= siblingCount;

      // Show ellipsis before current range (after first page)
      const showLeftEllipsis = i === 2 && currentPage > 2 + siblingCount;
      // Show ellipsis after current range (before last page)
      const showRightEllipsis = i === totalPages - 1 && currentPage < totalPages - 1 - siblingCount;

      if (showLeftEllipsis || showRightEllipsis) {
        pages.push({ type: 'ellipsis', key: `ellipsis-${i}` });
      } else if (showPage) {
        pages.push({ type: 'page', number: i, key: i });
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Page Info */}
      {showPageInfo && (
        <div className="text-sm text-brown-600">
          {t('pagination.pageOf', { current: currentPage, total: totalPages })}
          {totalItems > 0 && itemLabel && ` (${totalItems} ${itemLabel})`}
        </div>
      )}

      {/* Pagination Buttons */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gold-300 hover:border-gold-500 hover:bg-gold-50 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gold-300 disabled:hover:bg-transparent"
          aria-label={t('common.previous')}
        >
          <ChevronLeft size={20} />
          <span className="hidden sm:inline">{t('common.previous')}</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {pageNumbers.map((item) => {
            if (item.type === 'ellipsis') {
              return (
                <span key={item.key} className="px-2 text-gold-500">
                  ...
                </span>
              );
            }

            return (
              <button
                key={item.key}
                onClick={() => onPageChange(item.number)}
                className={`w-10 h-10 rounded-lg font-medium transition ${
                  currentPage === item.number
                    ? 'bg-gold-500 text-white shadow-gold-soft'
                    : 'bg-ivory-100 text-brown-700 hover:bg-gold-50 border-2 border-gold-300 hover:border-gold-500'
                }`}
                aria-label={`${t('pagination.goToPage')} ${item.number}`}
                aria-current={currentPage === item.number ? 'page' : undefined}
              >
                {item.number}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gold-300 hover:border-gold-500 hover:bg-gold-50 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gold-300 disabled:hover:bg-transparent"
          aria-label={t('common.next')}
        >
          <span className="hidden sm:inline">{t('common.next')}</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

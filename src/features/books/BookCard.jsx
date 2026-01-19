import { ChevronRight } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatPrice } from '../../utils/price';

export function BookCard({ book, onClick }) {
  const { t } = useTranslation();
  const imageUrl = book.coverImage || book.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop';

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={book.title}
        className="w-full h-64 object-contain"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop';
        }}
      />
      <div className="p-5">
        <span className="text-sm text-blue-600 font-medium">{book.category}</span>
        <h3 className="text-xl font-bold text-gray-800 mt-1 mb-2 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{t('book.by')} {book.author}</p>

        {book.stock !== undefined && (
          <p className={`text-xs mb-2 ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {book.stock > 0 ? t('book.inStock', { count: book.stock }) : t('book.outOfStock')}
          </p>
        )}

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">{formatPrice(book.price)}{t('common.currencySymbol')}</span>
          <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition flex items-center gap-1">
            {t('orders.viewDetails')}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

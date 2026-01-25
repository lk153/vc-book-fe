import { ChevronRight } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatPrice } from '../../utils/price';

export function BookCard({ book, onClick }) {
  const { t } = useTranslation();
  const imageUrl = book.coverImage || book.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop';

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-gold-soft transition overflow-hidden cursor-pointer h-full flex flex-col border border-gold-200/50"
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={book.title}
        className="w-full h-64 object-contain bg-ivory-50"
        onError={(e) => {
          e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop';
        }}
      />
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-sm text-gold-600 font-medium">{book.category}</span>
        <h3 className="text-xl font-bold text-brown-800 mt-1 mb-2 line-clamp-2 font-serif">{book.title}</h3>
        <p className="text-brown-600 text-sm mb-3">{t('book.by')} {book.author}</p>

        {book.stock !== undefined && (
          <p className={`text-xs mb-2 ${book.stock > 0 ? 'text-green-600' : 'text-crimson-400'}`}>
            {book.stock > 0 ? t('book.inStock', { count: book.stock }) : t('book.outOfStock')}
          </p>
        )}

        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-crimson-400 font-serif">{formatPrice(book.price)}{t('common.currencySymbol')}</span>
          <button className="bg-gold-100 text-gold-700 px-4 py-2 rounded-lg hover:bg-gold-200 transition flex items-center gap-1">
            {t('orders.viewDetails')}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

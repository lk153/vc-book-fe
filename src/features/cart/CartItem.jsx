import { useTranslation } from '../../i18n/LanguageContext';
import { formatPrice } from '../../utils/price';

export function CartItem({ item, updateCartQuantity }) {
  const { t } = useTranslation();

  return (
    <div className="p-6 flex gap-4">
      <img
        src={item.image}
        alt={item.title}
        className="w-24 h-32 object-contain rounded-lg bg-ivory-50"
      />
      <div className="flex-1">
        <h3 className="text-xl font-bold text-brown-800 mb-1 font-serif">{item.title}</h3>
        <p className="text-brown-600 mb-3">{t('book.by')} {item.author}</p>
        <p className="text-lg font-semibold text-gold-600">{formatPrice(item.price)}{t('common.currencySymbol')}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 bg-gold-100 hover:bg-gold-200 rounded font-bold text-gold-700"
          >
            -
          </button>
          <span className="w-12 text-center font-semibold text-brown-800">{item.quantity}</span>
          <button
            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 bg-gold-100 hover:bg-gold-200 rounded font-bold text-gold-700"
          >
            +
          </button>
        </div>
        <p className="text-xl font-bold text-crimson-400 font-serif">
          {formatPrice(item.price * item.quantity)}{t('common.currencySymbol')}
        </p>
      </div>
    </div>
  );
}

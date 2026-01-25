import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatPrice } from '../../utils/price';
import { useBookDetail } from './useBooks';
import { useCart } from '../../context/CartContext';
import { Navigation } from '../../components/Navigation';

export function BookDetailPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const { t } = useTranslation();
  const { book, isLoading: bookLoading, error: bookError } = useBookDetail(bookId);
  const { addToCart, addToCartLoading } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const isOutOfStock = book?.stock === 0 || book?.stock === undefined;
  const maxQuantity = book?.stock || 1;

  const handleAddToCart = async () => {
    setError(null);
    setShowErrorPopup(false);

    if (isOutOfStock) {
      setError(t('toast.outOfStock'));
      setShowErrorPopup(true);
      toast.error(t('toast.outOfStock'));
      return;
    }

    if (quantity > maxQuantity) {
      setError(t('toast.maxStock', { count: maxQuantity }));
      setShowErrorPopup(true);
      toast.error(t('toast.maxStock', { count: maxQuantity }));
      return;
    }

    try {
      await addToCart(book, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      const errorMessage = err.message || 'Failed to add to cart';

      if (errorMessage.toLowerCase().includes('stock') ||
        errorMessage.toLowerCase().includes('out of stock') ||
        errorMessage.toLowerCase().includes('insufficient')) {
        setError('Sorry, this book is currently out of stock or has insufficient stock');
      } else {
        setError(errorMessage);
      }

      setShowErrorPopup(true);
    }
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
    setError(null);
  };

  // Loading state
  if (bookLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory-100 via-ivory-50 to-ivory-200">
        <Navigation showBackButton={true} />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-gold-500 mb-4" size={48} />
            <p className="text-xl text-brown-600">{t('book.loadingDetails')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (bookError || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory-100 via-ivory-50 to-ivory-200">
        <Navigation showBackButton={true} />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-crimson-50 border border-crimson-200 rounded-lg p-8 text-center">
            <AlertCircle className="mx-auto text-crimson-400 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-crimson-500 mb-2 font-serif">{t('book.notFound')}</h2>
            <p className="text-crimson-400 mb-6">{bookError?.message || t('book.bookNotExist')}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gold-500 text-white px-6 py-3 rounded-lg hover:bg-gold-600 transition"
            >
              {t('nav.backToHome')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-100 via-ivory-50 to-ivory-200 bg-chinese-pattern">
      <Navigation showBackButton={true} />

      {/* Error Popup Modal */}
      {showErrorPopup && error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-ivory-50 rounded-xl shadow-2xl max-w-md w-full p-6 animate-bounce-in border border-crimson-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="text-crimson-400" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-brown-800 mb-2 font-serif">Out of Stock</h3>
                <p className="text-brown-600 mb-4">{error}</p>
                <button
                  onClick={closeErrorPopup}
                  className="w-full bg-crimson-400 text-white py-2 px-4 rounded-lg hover:bg-crimson-500 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gold-200/50">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <img
                src={book.coverImage || book.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'}
                alt={book.title}
                className="w-full h-96 object-contain rounded-lg shadow-lg bg-ivory-50"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop';
                }}
              />
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gold-600 font-medium mb-2">{book.category}</span>
              <h1 className="text-4xl font-bold text-brown-800 mb-3 font-serif">{book.title}</h1>
              <p className="text-xl text-brown-600 mb-6">{t('book.by')} {book.author}</p>

              <p className="text-brown-700 mb-4 leading-relaxed">
                {book.description || 'No description available'}
              </p>

              {book.isbn && (
                <p className="text-sm text-brown-600 mb-2">
                  <span className="font-semibold">ISBN:</span> {book.isbn}
                </p>
              )}
              {book.publisher && (
                <p className="text-sm text-brown-600 mb-2">
                  <span className="font-semibold">Publisher:</span> {book.publisher}
                </p>
              )}
              {book.pages && (
                <p className="text-sm text-brown-600 mb-2">
                  <span className="font-semibold">Pages:</span> {book.pages}
                </p>
              )}

              <div className="border-t border-gold-200 pt-6 mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-crimson-400 font-serif">{formatPrice(book.price)}{t('common.currencySymbol')}</span>

                  {book.stock !== undefined && (
                    <div className={`px-4 py-2 rounded-full font-semibold text-sm ${isOutOfStock
                      ? 'bg-crimson-100 text-crimson-500'
                      : book.stock < 10
                        ? 'bg-gold-100 text-gold-700'
                        : 'bg-green-100 text-green-700'
                      }`}>
                      {isOutOfStock
                        ? t('book.outOfStock')
                        : book.stock < 10
                          ? t('book.onlyLeft', { count: book.stock })
                          : t('book.inStock', { count: book.stock })
                      }
                    </div>
                  )}
                </div>

                {!isOutOfStock && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-brown-700 mb-2">
                      {t('book.quantity')} {book.stock && `(${t('book.max')}: ${book.stock})`}
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-gold-100 hover:bg-gold-200 rounded-lg font-bold text-gold-700 transition"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-xl font-semibold w-12 text-center text-brown-800">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                        className="w-10 h-10 bg-gold-100 hover:bg-gold-200 rounded-lg font-bold text-gold-700 transition"
                        disabled={quantity >= maxQuantity}
                      >
                        +
                      </button>
                    </div>
                    {quantity >= maxQuantity && book.stock && (
                      <p className="text-sm text-gold-600 mt-2">
                        {t('book.maxQuantity')}
                      </p>
                    )}
                  </div>
                )}

                {isOutOfStock ? (
                  <button
                    disabled
                    className="w-full py-4 rounded-lg font-bold text-lg bg-brown-200 text-brown-500 cursor-not-allowed"
                  >
                    {t('book.outOfStock')}
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={addToCartLoading}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition flex items-center justify-center ${addedToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-600 hover:to-gold-700 shadow-gold-soft'
                      } disabled:bg-brown-300 disabled:cursor-not-allowed`}
                  >
                    {addToCartLoading ? (
                      <>{t('book.adding')}</>
                    ) : addedToCart ? (
                      <>
                        <CheckCircle className="mr-2" size={20} />
                        {t('book.addedToCart')}
                      </>
                    ) : (
                      <>{t('book.addToCart')}</>
                    )}
                  </button>
                )}

                {isOutOfStock && (
                  <button
                    onClick={() => toast.info(t('toast.notifyFeature'))}
                    className="w-full mt-3 py-3 rounded-lg font-medium text-gold-600 border-2 border-gold-500 hover:bg-gold-50 transition"
                  >
                    {t('book.notifyMe')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

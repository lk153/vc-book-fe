import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function BookDetailPage({ book, cart, addToCart, setCurrentPage, loading }) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const isOutOfStock = book.stock === 0 || book.stock === undefined;
  const maxQuantity = book.stock || 1;

  const handleAddToCart = async () => {
    setError(null);
    setShowErrorPopup(false);

    // Check stock before adding
    if (isOutOfStock) {
      setError('This book is currently out of stock');
      setShowErrorPopup(true);
      return;
    }

    if (quantity > maxQuantity) {
      setError(`Only ${maxQuantity} items available in stock`);
      setShowErrorPopup(true);
      return;
    }

    try {
      await addToCart(book, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      // Handle API errors (like out of stock from server)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation cart={cart} setCurrentPage={setCurrentPage} showBackButton={true} />

      {/* Error Popup Modal */}
      {showErrorPopup && error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-bounce-in">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="text-red-500" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Out of Stock</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={closeErrorPopup}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <img 
                src={book.coverImage || book.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'} 
                alt={book.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop';
                }}
              />
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-blue-600 font-medium mb-2">{book.category}</span>
              <h1 className="text-4xl font-bold text-gray-800 mb-3">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-6">by {book.author}</p>
              
              <p className="text-gray-700 mb-4 leading-relaxed">
                {book.description || 'No description available'}
              </p>

              {/* Additional Book Info */}
              {book.isbn && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">ISBN:</span> {book.isbn}
                </p>
              )}
              {book.publisher && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Publisher:</span> {book.publisher}
                </p>
              )}
              {book.pages && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Pages:</span> {book.pages}
                </p>
              )}
              
              <div className="border-t border-gray-200 pt-6 mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-blue-600">${book.price.toFixed(2)}</span>
                  
                  {/* Stock Status Badge */}
                  {book.stock !== undefined && (
                    <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
                      isOutOfStock 
                        ? 'bg-red-100 text-red-700' 
                        : book.stock < 10 
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                    }`}>
                      {isOutOfStock 
                        ? 'Out of Stock' 
                        : book.stock < 10 
                          ? `Only ${book.stock} left`
                          : `${book.stock} in stock`
                      }
                    </div>
                  )}
                </div>

                {/* Quantity Selector - Only show if in stock */}
                {!isOutOfStock && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity {book.stock && `(Max: ${book.stock})`}
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700 transition"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                        className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700 transition"
                        disabled={quantity >= maxQuantity}
                      >
                        +
                      </button>
                    </div>
                    {quantity >= maxQuantity && book.stock && (
                      <p className="text-sm text-yellow-600 mt-2">
                        Maximum available quantity reached
                      </p>
                    )}
                  </div>
                )}

                {/* Add to Cart / Out of Stock Button */}
                {isOutOfStock ? (
                  <button
                    disabled
                    className="w-full py-4 rounded-lg font-bold text-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition flex items-center justify-center ${
                      addedToCart
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                  >
                    {loading ? (
                      'Adding...'
                    ) : addedToCart ? (
                      <>
                        <CheckCircle className="mr-2" size={20} />
                        Added to Cart!
                      </>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                )}

                {/* Notify When Available */}
                {isOutOfStock && (
                  <button
                    onClick={() => {
                      alert('Notification feature coming soon! We will notify you when this book is back in stock.');
                    }}
                    className="w-full mt-3 py-3 rounded-lg font-medium text-blue-600 border-2 border-blue-600 hover:bg-blue-50 transition"
                  >
                    Notify Me When Available
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
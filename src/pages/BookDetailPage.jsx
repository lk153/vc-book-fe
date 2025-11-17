import React, { useState } from 'react';
import Navigation from '../components/Navigation';

export default function BookDetailPage({ book, cart, addToCart, setCurrentPage }) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    addToCart(book, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation cart={cart} setCurrentPage={setCurrentPage} showBackButton={true} />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <img 
                src={book.image} 
                alt={book.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-blue-600 font-medium mb-2">{book.category}</span>
              <h1 className="text-4xl font-bold text-gray-800 mb-3">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-6">by {book.author}</p>
              
              <p className="text-gray-700 mb-8 leading-relaxed">{book.description}</p>
              
              <div className="border-t border-gray-200 pt-6 mt-auto">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold text-blue-600">${book.price}</span>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition ${
                    addedToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// components/HomePage.jsx
import React from 'react';
import Navigation from '../components/Navigation';
import CategoryFilter from '../components/CategoryFilter';
import BookCard from '../components/BookCard';
import { Loader2 } from 'lucide-react';

export default function HomePage({ 
  books, 
  cart, 
  selectedCategory, 
  setSelectedCategory, 
  setCurrentPage, 
  setSelectedBook,
  loading,
  error,
  categories,
  user,
  onLogout,
}) {
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation cart={cart} setCurrentPage={setCurrentPage} user={user} onLogout={onLogout} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Books</h2>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation cart={cart} setCurrentPage={setCurrentPage} user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Discover Your Next Great Read</h1>
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <span className="ml-4 text-xl text-gray-600">Loading books...</span>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No books found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => (
              <BookCard
                key={book._id || book.id}
                book={book}
                onClick={() => {
                  setSelectedBook(book);
                  setCurrentPage('detail');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
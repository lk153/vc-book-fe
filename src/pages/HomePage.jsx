import React from 'react';
import Navigation from '../components/Navigation';
import CategoryFilter from '../components/CategoryFilter';
import BookCard from '../components/BookCard';

export default function HomePage({ booksData, cart, selectedCategory, setSelectedCategory, setCurrentPage, setSelectedBook }) {
  const filteredBooks = selectedCategory === 'All' 
    ? booksData 
    : booksData.filter(book => book.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation cart={cart} setCurrentPage={setCurrentPage} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Discover Your Next Great Read</h1>
        
        <CategoryFilter 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => {
                setSelectedBook(book);
                setCurrentPage('detail');
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
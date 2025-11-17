import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function BookCard({ book, onClick }) {
  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <img 
        src={book.image} 
        alt={book.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-5">
        <span className="text-sm text-blue-600 font-medium">{book.category}</span>
        <h3 className="text-xl font-bold text-gray-800 mt-1 mb-2">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-3">by {book.author}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">${book.price}</span>
          <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition flex items-center gap-1">
            View Details
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
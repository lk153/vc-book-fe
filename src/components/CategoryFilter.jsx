import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { categories } from '../data/booksData';

export default function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4 hover:text-blue-600 transition"
      >
        <span>Categories</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isExpanded && (
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 shadow'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
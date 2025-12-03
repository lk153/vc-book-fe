import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';

import { 
  ChevronDown, 
  BookOpen, 
  Sparkles, 
  Briefcase, 
  User, 
  Heart, 
  Compass,
  TrendingUp,
  Star,
  Clock
} from 'lucide-react';

// Category configuration with icons and descriptions
const categoryConfig = {
  'All': {
    icon: Compass,
    description: 'Browse all available books',
    color: 'blue',
  },
  'Fiction': {
    icon: BookOpen,
    description: 'Imaginative stories and novels',
    color: 'purple',
  },
  'Science Fiction': {
    icon: Sparkles,
    description: 'Futuristic and sci-fi adventures',
    color: 'indigo',
  },
  'Business': {
    icon: Briefcase,
    description: 'Management and entrepreneurship',
    color: 'green',
  },
  'Biography': {
    icon: User,
    description: 'Life stories and memoirs',
    color: 'orange',
  },
  'Self-Help': {
    icon: Heart,
    description: 'Personal growth and wellness',
    color: 'pink',
  },
};

export default function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsOpen(false);
  };

  // Get config for category
  const getConfig = (category) => {
    return categoryConfig[category] || {
      icon: BookOpen,
      description: `Explore ${category} books`,
      color: 'blue',
    };
  };

  const selectedConfig = getConfig(selectedCategory);
  const SelectedIcon = selectedConfig.icon;

  return (
    <div className="mb-8 relative" ref={menuRef}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        {/* Left Section - Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{t('home.categories')}</h2>
          <p className="text-sm text-gray-600">{t('home.findBooks')}</p>
        </div>

        {/* Right Section - Mega Menu Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md hover:shadow-lg font-medium"
        >
          <SelectedIcon size={20} />
          <span className="hidden sm:inline">{t('nav.browseCategories')}</span>
          <span className="sm:hidden">{t('home.categories')}</span>
          <ChevronDown 
            size={18} 
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Current Selection Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <span className="text-gray-500">{t('home.viewing')}:</span>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-200 rounded-lg">
          <SelectedIcon size={16} className="text-blue-600" />
          <span className="font-semibold text-gray-800">{selectedCategory}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600 text-xs">{selectedConfig.description}</span>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-slideDown overflow-hidden">
          {/* Header with gradient */}
          <div className="px-8 py-6 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">{t('home.exploreCategories')}</h3>
                <p className="text-blue-100 text-sm">Choose a category to discover amazing books</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {/* Main Categories Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                <h4 className="text-lg font-bold text-gray-800">MAIN CATEGORIES</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const config = getConfig(category);
                  const Icon = config.icon;
                  const isSelected = selectedCategory === category;
                  const colorClasses = {
                    blue: 'from-blue-500 to-blue-600',
                    purple: 'from-purple-500 to-purple-600',
                    indigo: 'from-indigo-500 to-indigo-600',
                    green: 'from-green-500 to-green-600',
                    orange: 'from-orange-500 to-orange-600',
                    pink: 'from-pink-500 to-pink-600',
                  };

                  return (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`group relative flex items-start gap-4 p-5 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? `bg-gradient-to-br ${colorClasses[config.color]} border-transparent text-white shadow-xl scale-105`
                          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg hover:scale-102'
                      }`}
                    >
                      {/* Icon Container */}
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition ${
                        isSelected 
                          ? 'bg-white bg-opacity-20 backdrop-blur-sm' 
                          : `bg-gradient-to-br ${colorClasses[config.color]} bg-opacity-10`
                      }`}>
                        <Icon 
                          size={28} 
                          className={isSelected ? 'text-white' : `text-${config.color}-600`}
                          strokeWidth={2}
                        />
                      </div>

                      {/* Category Content */}
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-lg mb-1 ${
                          isSelected ? 'text-white' : 'text-gray-800 group-hover:text-blue-700'
                        }`}>
                          {category}
                        </div>
                        <div className={`text-sm leading-snug ${
                          isSelected ? 'text-white text-opacity-90' : 'text-gray-500 group-hover:text-gray-700'
                        }`}>
                          {config.description}
                        </div>
                      </div>

                      {/* Selected Check Badge */}
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <svg className={`w-4 h-4 text-${config.color}-600`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Hover Arrow */}
                      {!isSelected && (
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:shadow-md transition group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                    <Compass size={20} className="text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800 text-sm">View All</div>
                    <div className="text-xs text-gray-600">Browse everything</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    // Future: Popular categories
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-md transition group"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition">
                    <TrendingUp size={20} className="text-orange-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800 text-sm">Popular</div>
                    <div className="text-xs text-gray-600">Trending now</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    // Future: New releases
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                    <Star size={20} className="text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800 text-sm">New Releases</div>
                    <div className="text-xs text-gray-600">Latest books</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-800">{categories.length}</span> Categories Available
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-gray-600">Updated daily</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}
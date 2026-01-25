import { useState, useRef, useCallback } from 'react';
import { useTranslation } from '../../i18n/LanguageContext';
import { useClickOutside } from '../../hooks/useClickOutside';

import {
  ChevronDown,
  BookOpen,
  Compass,
  TrendingUp,
  Star,
  Clock,
  Loader2
} from 'lucide-react';

// Color palette for categories - Traditional Chinese theme
const categoryColors = ['gold', 'brown', 'crimson', 'green', 'orange', 'purple'];

export function CategoryFilter({ categories, selectedCategory, setSelectedCategory, isLoading }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleClose = useCallback(() => setIsOpen(false), []);
  useClickOutside(menuRef, handleClose, isOpen);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setIsOpen(false);
  };

  // Get color for category by index
  const getColor = (index) => categoryColors[index % categoryColors.length];

  // Find selected category object
  const selectedCategoryObj = categories.find(c => c.name === selectedCategory) || categories[0];
  const selectedDescription = selectedCategoryObj?.description || '';

  // Check if "All" category
  const isAllCategory = (name) => name === t('categories.all');

  return (
    <div className="mb-8 relative" ref={menuRef}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        {/* Left Section - Title */}
        <div>
          <h2 className="text-2xl font-bold text-brown-800 mb-1 font-serif">{t('home.categories')}</h2>
          <p className="text-sm text-brown-600">{t('home.findBooks')}</p>
        </div>

        {/* Right Section - Mega Menu Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg hover:from-gold-600 hover:to-gold-700 transition shadow-gold-soft hover:shadow-gold-glow font-medium disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : isAllCategory(selectedCategory) ? (
            <Compass size={20} />
          ) : (
            <BookOpen size={20} />
          )}
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
        <span className="text-brown-500">{t('home.viewing')}:</span>
        <div className="flex items-center gap-2 px-4 py-2 bg-ivory-50 border-2 border-gold-300 rounded-lg">
          {isAllCategory(selectedCategory) ? (
            <Compass size={16} className="text-gold-600" />
          ) : (
            <BookOpen size={16} className="text-gold-600" />
          )}
          <span className="font-semibold text-brown-800">{selectedCategory}</span>
          {selectedDescription && (
            <>
              <span className="text-gold-400">•</span>
              <span className="text-brown-600 text-xs">{selectedDescription}</span>
            </>
          )}
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-ivory-50 rounded-2xl shadow-2xl border border-gold-300/50 z-50 animate-slideDown overflow-hidden">
          {/* Header with gradient */}
          <div className="px-8 py-6 bg-gradient-to-br from-gold-500 via-gold-600 to-brown-600 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2 font-serif">{t('home.exploreCategories')}</h3>
                <p className="text-gold-100 text-sm">{t('home.chooseCategory')}</p>
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
                <div className="w-1 h-6 bg-gold-500 rounded-full"></div>
                <h4 className="text-lg font-bold text-brown-800 font-serif">{t('home.mainCategories')}</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category, index) => {
                  const color = isAllCategory(category.name) ? 'gold' : getColor(index);
                  const Icon = isAllCategory(category.name) ? Compass : BookOpen;
                  const isSelected = selectedCategory === category.name;
                  const colorClasses = {
                    gold: 'from-gold-500 to-gold-600',
                    brown: 'from-brown-400 to-brown-500',
                    crimson: 'from-crimson-400 to-crimson-500',
                    green: 'from-green-500 to-green-600',
                    orange: 'from-orange-500 to-orange-600',
                    purple: 'from-purple-500 to-purple-600',
                  };

                  return (
                    <button
                      key={category.name}
                      onClick={() => handleCategorySelect(category.name)}
                      className={`group relative flex items-start gap-4 p-5 rounded-xl border-2 transition-all text-left ${isSelected
                        ? `bg-gradient-to-br ${colorClasses[color]} border-transparent text-white shadow-xl scale-105`
                        : 'bg-ivory-100 border-gold-200 hover:border-gold-400 hover:shadow-gold-soft hover:scale-102'
                        }`}
                    >
                      {/* Icon Container */}
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition ${isSelected
                        ? 'bg-white bg-opacity-20 backdrop-blur-sm'
                        : `bg-gradient-to-br ${colorClasses[color]} bg-opacity-10`
                        }`}>
                        <Icon
                          size={28}
                          className={isSelected ? 'text-white' : `text-${color}-600`}
                          strokeWidth={2}
                        />
                      </div>

                      {/* Category Content */}
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-lg mb-1 font-serif ${isSelected ? 'text-white' : 'text-brown-800 group-hover:text-gold-700'
                          }`}>
                          {category.name}
                        </div>
                        <div className={`text-sm leading-snug ${isSelected ? 'text-white text-opacity-90' : 'text-brown-500 group-hover:text-brown-700'
                          }`}>
                          {category.description || `${t('home.findBooks')} ${category.name}`}
                        </div>
                      </div>

                      {/* Selected Check Badge */}
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <svg className={`w-4 h-4 text-${color}-600`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Hover Arrow */}
                      {!isSelected && (
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition">
                          <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="border-t border-gold-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setSelectedCategory(t('categories.all'));
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-gold-50 to-ivory-100 rounded-lg hover:shadow-gold-soft transition group"
                >
                  <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center group-hover:bg-gold-200 transition">
                    <Compass size={20} className="text-gold-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-brown-800 text-sm">{t('home.viewAll')}</div>
                    <div className="text-xs text-brown-600">{t('home.browseEverything')}</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-crimson-50 to-orange-50 rounded-lg hover:shadow-md transition group"
                >
                  <div className="w-10 h-10 bg-crimson-100 rounded-lg flex items-center justify-center group-hover:bg-crimson-200 transition">
                    <TrendingUp size={20} className="text-crimson-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-brown-800 text-sm">{t('home.popular')}</div>
                    <div className="text-xs text-brown-600">{t('home.trending')}</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                    <Star size={20} className="text-green-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-brown-800 text-sm">{t('home.newReleases')}</div>
                    <div className="text-xs text-brown-600">{t('home.latestBooks')}</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="px-8 py-5 bg-ivory-200 border-t border-gold-200">
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gold-500 rounded-full animate-pulse"></div>
                <span className="text-brown-600">
                  <span className="font-semibold text-brown-800">{categories.length}</span> {t('home.categoriesAvailable')}
                </span>
              </div>
              <div className="w-px h-4 bg-gold-300"></div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gold-500" />
                <span className="text-brown-600">{t('home.updatedDaily')}</span>
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

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTranslation } from '../i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const { language, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const desktopRef = useRef(null);
  const mobileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const desktop = desktopRef.current;
      const mobile = mobileRef.current;

      const clickedInsideDesktop = desktop && desktop.contains(event.target);
      const clickedInsideMobile = mobile && mobile.contains(event.target);

      // If click outside both -> close
      if (!clickedInsideDesktop && !clickedInsideMobile) {
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

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setIsOpen(false);
  };

  const currentLang = languages[language];

  return (
    <>
      {/* Desktop Version - Shows in Navigation Bar (md and up) */}
      <div className="hidden md:block relative" ref={desktopRef}>
        {/* Language Switcher Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition"
          aria-label="Change language"
        >
          <Globe size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {currentLang.flag} {currentLang.code.toUpperCase()}
          </span>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-slideDown" onClick={(e) => e.stopPropagation()}>
            {Object.values(languages).map((lang) => {
              const isSelected = language === lang.code;

              return (
                <button
                  key={lang.code}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLanguageChange(lang.code);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition ${isSelected
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="flex-1 text-left font-medium">{lang.name}</span>
                  {isSelected && (
                    <Check size={18} className="text-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Version - Floating Circle Button (bottom right) */}
      <div className="md:hidden" ref={mobileRef}>
        {/* Floating Circle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-50 transition-all duration-300 ${isOpen
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
            }`}
          aria-label="Change language"
        >
          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <div className="flex flex-col items-center">
              <Globe size={20} className="text-white" />
              <span className="text-[10px] font-bold text-white mt-0.5">
                {currentLang.code.toUpperCase()}
              </span>
            </div>
          )}
        </button>

        {/* Mobile Popup Modal */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fadeIn"
              onClick={() => setIsOpen(false)}
            />

            {/* Language Selection Modal */}
            <div className="fixed bottom-24 right-6 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slideUp">
              {/* Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={20} />
                  <h3 className="font-bold text-lg">{t('nav.choose_lang')}</h3>
                </div>
                <p className="text-sm text-blue-100">{t('nav.select_preferred_lang')}</p>
              </div>

              {/* Language Options */}
              <div className="py-2">
                {Object.values(languages).map((lang) => {
                  const isSelected = language === lang.code;

                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center gap-4 px-5 py-4 transition ${isSelected
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50'
                        }`}
                    >
                      <span className="text-3xl">{lang.flag}</span>
                      <div className="flex-1 text-left">
                        <div className={`font-bold text-base ${isSelected ? 'text-blue-700' : 'text-gray-800'
                          }`}>
                          {lang.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {lang.code.toUpperCase()}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check size={18} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  {t('nav.lang_saved_auto')}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        /* Pulse animation for floating button */
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        /* Optional: Add pulse effect on mount */
        .fixed.bottom-6.right-6::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #2563eb);
          opacity: 0;
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}
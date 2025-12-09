import { createContext, useContext, useState, useEffect } from 'react';
import translations from './translation';

// Language Context
const LanguageContext = createContext();

// Available languages
export const LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
  },
  vi: {
    code: 'vi',
    name: 'Tiếng Việt',
    flag: '🇻🇳',
  },
};

// Language Provider Component
export function LanguageProvider({ children }) {
  // Get saved language from localStorage or default to English
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    if (!saved) return 'en';
    // Normalize stored value: handle accidentally stringified values like '"en"'
    try {
      // If saved is a quoted JSON string, JSON.parse will return the proper string
      const parsed = JSON.parse(saved);
      if (typeof parsed === 'string') return parsed;
    } catch (e) {
      // ignore JSON parse errors
    }

    // Fallback: strip surrounding quotes if present
    return saved.replace(/^"|"$/g, '') || 'en';
  });

  // Save to localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update HTML lang attribute for accessibility
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (lang) => {
    console.log('LanguageContext.changeLanguage called with:', lang);
    if (LANGUAGES[lang]) {
      setLanguage(lang);
    }
  };

  const value = {
    language,
    changeLanguage,
    languages: LANGUAGES,
    currentLanguage: LANGUAGES[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

// Helper hook to get translated text
export function useTranslation() {
  const { language } = useLanguage();

  const t = (key, params = {}) => {
    // Get translation from translations object
    const translation = getNestedTranslation(translations[language], key);

    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }

    // Replace parameters in translation
    return replaceParams(translation, params);
  };

  return { t, language };
}

// Helper function to get nested translation
function getNestedTranslation(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Helper function to replace parameters in translation
function replaceParams(text, params) {
  return Object.keys(params).reduce((result, key) => {
    return result.replace(new RegExp(`{${key}}`, 'g'), params[key]);
  }, text);
}
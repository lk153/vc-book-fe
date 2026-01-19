import { createContext, useContext, useState, useEffect } from 'react';
import translations from './translation';
import { adminEN } from './admin/en';
import { adminVI } from './admin/vi';

// Merge admin translations into main translations
const mergedTranslations = {
  en: { ...translations.en, ...adminEN },
  vi: { ...translations.vi, ...adminVI },
};

const LanguageContext = createContext();
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

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    if (!saved) return 'vi';

    // Handle both plain string (e.g., "vi") and JSON string (e.g., "\"vi\"")
    const cleanValue = saved.replace(/^"|"$/g, '');
    if (LANGUAGES[cleanValue]) {
      return cleanValue;
    }

    return 'vi';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
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

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key, params = {}) => {
    const translation = getNestedTranslation(mergedTranslations[language], key);

    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return key;
    }

    return replaceParams(translation, params);
  };

  return { t, language };
}

function getNestedTranslation(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function replaceParams(text, params) {
  return Object.keys(params).reduce((result, key) => {
    return result.replace(new RegExp(`{${key}}`, 'g'), params[key]);
  }, text);
}
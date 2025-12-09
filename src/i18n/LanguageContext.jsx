import { createContext, useContext, useState, useEffect } from 'react';
import translations from './translation';

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
    try {
      const parsed = JSON.parse(saved);
      if (typeof parsed === 'string') return parsed;
    } catch (e) {
      console.log('Error parsing saved language from localStorage:', e);
    }

    return saved.replace(/^"|"$/g, '') || 'en';
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
    const translation = getNestedTranslation(translations[language], key);

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
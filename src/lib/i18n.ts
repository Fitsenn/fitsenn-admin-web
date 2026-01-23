import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import ro from '@/locales/ro.json';

const STORAGE_KEY = 'language';
const DEFAULT_LANGUAGE = 'ro';

const getStoredLanguage = (): string => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }
  return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_LANGUAGE;
};

const resources = {
  en: { translation: en },
  ro: { translation: ro },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

export { i18n, STORAGE_KEY as LANGUAGE_STORAGE_KEY };

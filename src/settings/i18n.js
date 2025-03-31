import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Import your translation files
import translationENG from './../assets/locales/eng.json';
import translationKZ from './../assets/locales/kz.json';
import translationRU from './../assets/locales/ru.json';

const resources = {
  ru: {
    translation: translationRU
  },
  kz: {
    translation: translationKZ
  },
  eng: {
    translation: translationENG
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'kz',
    debug: true,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

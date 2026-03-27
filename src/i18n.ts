import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Locale translations
import nlCommon from './locales/nl.json';
import enCommon from './locales/en.json';
import deCommon from './locales/de.json';
import frCommon from './locales/fr.json';

export const LANGUAGES = [
  { code: 'nl', name: 'Nederlands', englishName: 'Dutch' },
  { code: 'en', name: 'English', englishName: 'English' },
  { code: 'de', name: 'Deutsch', englishName: 'German' },
  { code: 'fr', name: 'Français', englishName: 'French' },
];

i18next
  .use(LanguageDetector)
  .init({
    resources: {
      nl: { common: nlCommon },
      en: { common: enCommon },
      de: { common: deCommon },
      fr: { common: frCommon },
    },
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: 'nl',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'ofs_lang',
      caches: ['localStorage'],
    },
  });

export default i18next;

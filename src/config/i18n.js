import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DEFAULT_LANGUAGE } from 'config/config';
import translations from 'config/translations.json';

i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: localStorage.getItem('language') || DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

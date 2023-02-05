import { useState } from 'react';
import moment from 'moment';

import { LANGUAGES, DEFAULT_LANGUAGE } from 'config/config';
import i18n from 'config/i18n';

function Languages({ renderView }) {
  const [currentLanguageCode, setCurrentLanguageCode] = useState(localStorage.getItem('language') || DEFAULT_LANGUAGE);

  const handleChangeLanguage = languageCode => () => {
    localStorage.setItem('language', languageCode);
    i18n.changeLanguage(languageCode);
    setCurrentLanguageCode(languageCode);
    moment.locale(languageCode);
  }

  return renderView({
    languages: LANGUAGES,
    currentLanguageCode,
    handleChangeLanguage,
  });
}

export default Languages;

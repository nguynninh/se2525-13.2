import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en_common from './locales/en/common.json';

import vi_common from './locales/vi/common.json';

const resources = {
  en: {
    common: en_common,
  },
  vi: {
    common: vi_common,
  },
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (cb: any) => {
    const locales = RNLocalize.getLocales();
    cb(locales[0]?.languageCode || 'en');
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: 'en',
    ns: [
        'common',
    ],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });

export default i18n;

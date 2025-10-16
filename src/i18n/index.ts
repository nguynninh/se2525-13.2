import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en_common from './locales/en/common.json';
import en_auth from './locales/en/auth.json';
import en_home from './locales/en/home.json';
import vi_profile from './locales/vi/profile.json';

import vi_common from './locales/vi/common.json';
import vi_auth from './locales/vi/auth.json';
import vi_home from './locales/vi/home.json';
import en_profile from './locales/en/profile.json';

const resources = {
  en: {
    common: en_common,
    auth: en_auth,
    home: en_home,
    profile: en_profile,
  },
  vi: {
    common: vi_common,
    auth: vi_auth,
    home: vi_home,
    profile: vi_profile,
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
        'auth',
        'home',
        'profile',
    ],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });

export default i18n;

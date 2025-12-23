import i18n, { t } from 'i18next';
import { initReactI18next } from '../../node_modules/react-i18next';
import * as RNLocalize from 'react-native-localize';

import en_common from './locales/en/common.json';
import en_auth from './locales/en/auth.json';
import en_home from './locales/en/home.json';
import vi_profile from './locales/vi/profile.json';

import vi_common from './locales/vi/common.json';
import vi_auth from './locales/vi/auth.json';
import vi_home from './locales/vi/home.json';
import en_profile from './locales/en/profile.json';

import cn_common from './locales/cn/common.json';
import cn_auth from './locales/cn/auth.json';
import cn_home from './locales/cn/home.json';
import cn_profile from './locales/cn/profile.json';

import jp_common from './locales/jp/common.json';
import jp_auth from './locales/jp/auth.json';
import jp_home from './locales/jp/home.json';
import jp_profile from './locales/jp/profile.json';

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
  cn: {
    common: cn_common,
    auth: cn_auth,
    home: cn_home,
    profile: cn_profile,
  },
  jp: {
    common: jp_common,
    auth: jp_auth,
    home: jp_home,
    profile: jp_profile,
  },
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (cb: any) => {
    const locales = RNLocalize.getLocales();
    cb(locales[0]?.languageCode || 'en');
  },
  init: () => { },
  cacheUserLanguage: () => { },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
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

const getLanguageLabel = (code: string) => {
  switch (code) {
    case 'en':
      return t('profile:english');
    case 'vi':
      return t('profile:vietnamese');
    case 'cn':
      return t('profile:chinese');
    case 'jp':
      return t('profile:japanese');
    default:
      return '';
  }
};

const getListLanguages = () => ([
  { code: 'system', label: t('profile:language_system_default') },
  { code: 'en', label: t('profile:english') },
  { code: 'vi', label: t('profile:vietnamese') },
  { code: 'cn', label: t('profile:chinese') },
  { code: 'jp', label: t('profile:japanese') },
]);

export { getListLanguages };
export { getLanguageLabel };
export default i18n;

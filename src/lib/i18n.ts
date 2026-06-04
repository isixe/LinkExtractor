import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from '../locales/en/common.json'
import zh from '../locales/zh/common.json'

const SUPPORTED_LANGS = ['en', 'zh']
const DEFAULT_LANG = 'en'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      zh: { common: zh },
    },
    fallbackLng: DEFAULT_LANG,
    defaultNS: 'common',
    ns: ['common'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
      checkWhitelist: true,
    },
    returnObjects: true,
  })

const detected = i18n.language
if (detected && !SUPPORTED_LANGS.includes(detected)) {
  const base = detected.split('-')[0]
  i18n.changeLanguage(SUPPORTED_LANGS.includes(base) ? base : DEFAULT_LANG)
}

export default i18n
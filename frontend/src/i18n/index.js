import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from '../../public/locales/ar/ar.json';
import en from '../../public/locales/en/en.json';

const saved = localStorage.getItem('lang') || 'ar';
document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = saved;

i18n.use(initReactI18next).init({
  resources: { ar: { translation: ar }, en: { translation: en } },
  lng: saved,
  fallbackLng: 'ar',
  interpolation: { escapeValue: false }
});

i18n.on('languageChanged', lng => {
  localStorage.setItem('lang', lng);
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
});

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import uz from './locales/uz.json';
import ru from './locales/ru.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      uz: { translation: uz },
      ru: { translation: ru },
    },
    fallbackLng: 'uz',
    supportedLngs: ['uz', 'ru'],
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'chimboy_lang',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  });

// Keep <html lang> in sync with the active language (SEO + screen readers).
const syncHtmlLang = (lng) => {
  document.documentElement.lang = lng?.startsWith('ru') ? 'ru' : 'uz';
};
syncHtmlLang(i18n.language);
i18n.on('languageChanged', syncHtmlLang);

export default i18n;

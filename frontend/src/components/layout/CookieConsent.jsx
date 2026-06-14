import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie } from 'lucide-react';

export default function CookieConsent() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('chimboy_cookie_consent')) {
      const id = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(id);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('chimboy_cookie_consent', '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[90] p-4"
        >
          <div className="container-x flex flex-col items-center gap-4 rounded-xl bg-text p-4 text-white shadow-2xl sm:flex-row">
            <Cookie size={28} className="shrink-0 text-accent" />
            <p className="flex-1 text-sm">{t('misc.cookieMessage')}</p>
            <button
              onClick={accept}
              className="shrink-0 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              {t('misc.accept')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

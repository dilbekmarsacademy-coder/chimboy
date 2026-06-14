import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, ArrowUp, MessageCircle } from 'lucide-react';

export default function FloatingButtons() {
  const { t } = useTranslation();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-text text-white shadow-lg transition hover:bg-black"
            aria-label={t('misc.backToTop')}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href="https://t.me/chimboy_official"
        target="_blank"
        rel="noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#229ED9] text-white shadow-lg transition hover:scale-105"
        aria-label="Telegram"
      >
        <Send size={22} />
      </a>
      <a
        href="https://wa.me/998712001001"
        target="_blank"
        rel="noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
        aria-label="WhatsApp"
      >
        <MessageCircle size={22} />
      </a>
    </div>
  );
}

import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { getHeroSlides } from '../../services/contentService';
import { localized } from '../../utils/helpers';
import { Link } from 'react-router-dom';

export default function HeroSlider() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getHeroSlides().then(setSlides);
  }, []);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, slides.length]);

  if (!slides.length) {
    return <div className="aspect-[21/9] w-full animate-pulse bg-black/10 sm:aspect-[3/1]" />;
  }

  const slide = slides[index];

  return (
    <section className="relative h-[420px] w-full overflow-hidden bg-text sm:h-[480px] lg:h-[540px]">
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="container-x relative flex h-full items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl text-white"
          >
            <h1 className="text-3xl font-extrabold leading-tight drop-shadow sm:text-4xl lg:text-5xl">
              {localized(slide, 'title', lang)}
            </h1>
            <p className="mt-4 text-base text-white/90 sm:text-lg">{localized(slide, 'subtitle', lang)}</p>
            <Link
              to={slide.link}
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-primary-dark"
            >
              {localized(slide, 'cta', lang)}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30 sm:flex"
        aria-label="previous"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30 sm:flex"
        aria-label="next"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-7 bg-primary' : 'w-2 bg-white/60 hover:bg-white'
            }`}
            aria-label={`slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

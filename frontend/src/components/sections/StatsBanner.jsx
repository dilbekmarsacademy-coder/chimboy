import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'framer-motion';
import { Award, Package, Store, Users } from 'lucide-react';
import { getStats } from '../../services/contentService';

function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * to));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setValue(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  const formatted =
    to >= 1000000
      ? `${(value / 1000000).toFixed(value >= to ? 0 : 1)}M`
      : value.toLocaleString('ru-RU');

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

export default function StatsBanner() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const items = stats
    ? [
        { icon: Award, to: stats.yearsOfExperience, suffix: '+', label: t('stats.years') },
        { icon: Package, to: stats.products, suffix: '+', label: t('stats.products') },
        { icon: Store, to: stats.stores, suffix: '+', label: t('stats.stores') },
        { icon: Users, to: stats.customers, suffix: '+', label: t('stats.customers') },
      ]
    : [];

  return (
    <section className="bg-gradient-to-r from-primary-dark to-primary py-14 text-white">
      <div className="container-x grid grid-cols-2 gap-8 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex flex-col items-center text-center">
              <Icon size={36} className="mb-3 opacity-90" strokeWidth={1.5} />
              <span className="text-3xl font-extrabold sm:text-4xl">
                <Counter to={item.to} suffix={item.suffix} />
              </span>
              <span className="mt-1 text-sm text-white/85">{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import Skeleton from '../ui/Skeleton';
import { getNews } from '../../services/contentService';
import { localized } from '../../utils/helpers';

export default function LatestNews() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews(3).then((res) => {
      setNews(res);
      setLoading(false);
    });
  }, []);

  return (
    <section className="container-x py-12">
      <SectionHeading title={t('home.latestNews')} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="card" />)
          : news.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.1}>
                <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-surface shadow-card transition hover:shadow-cardHover">
                  <div className="overflow-hidden">
                    <img
                      src={item.image}
                      alt=""
                      className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      <Calendar size={14} />
                      {new Date(item.date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'uz-UZ')}
                    </span>
                    <h3 className="mt-2 line-clamp-2 font-bold leading-tight transition group-hover:text-primary">
                      {localized(item, 'title', lang)}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">
                      {localized(item, 'excerpt', lang)}
                    </p>
                    <button className="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-primary group-hover:gap-2">
                      {t('common.readMore')} <ArrowRight size={15} />
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Heart, Award, Factory, FlaskConical, Package, Truck, X } from 'lucide-react';
import StatsBanner from '../components/sections/StatsBanner';
import Reveal from '../components/ui/Reveal';
import Modal from '../components/ui/Modal';
import { getMilestones, getTeam, getCertificates } from '../services/contentService';
import { localized } from '../utils/helpers';

export default function About() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';
  const [milestones, setMilestones] = useState([]);
  const [team, setTeam] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    getMilestones().then(setMilestones);
    getTeam().then(setTeam);
    getCertificates().then(setCertificates);
  }, []);

  const values = [
    { icon: Leaf, title_uz: 'Tabiiylik', title_ru: 'Натуральность', desc_uz: "Faqat tabiiy xom ashyo va sifatli ingredientlar.", desc_ru: 'Только натуральное сырьё и качественные ингредиенты.' },
    { icon: Heart, title_uz: 'Mehr bilan', title_ru: 'С любовью', desc_uz: "Har bir mahsulot oilaviy an'ana va mehr bilan tayyorlanadi.", desc_ru: 'Каждый продукт готовится с семейной традицией и любовью.' },
    { icon: Award, title_uz: 'Sifat', title_ru: 'Качество', desc_uz: "Xalqaro standartlar va qat'iy sifat nazorati.", desc_ru: 'Международные стандарты и строгий контроль качества.' },
  ];

  const process = [
    { icon: FlaskConical, label_uz: 'Tanlash', label_ru: 'Отбор сырья' },
    { icon: Factory, label_uz: 'Ishlab chiqarish', label_ru: 'Производство' },
    { icon: Package, label_uz: 'Qadoqlash', label_ru: 'Упаковка' },
    { icon: Truck, label_uz: 'Yetkazib berish', label_ru: 'Доставка' },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-text py-20 text-center text-white">
        <img
          src="https://placehold.co/1600x500/B71C1C/FFFFFF/png?text=Chimboy"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="container-x relative">
          <h1 className="text-3xl font-extrabold sm:text-5xl">{t('about.title')}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">{t('about.tagline')}</p>
        </div>
      </div>

      {/* Story / timeline */}
      <section className="container-x py-14">
        <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">{t('about.story')}</h2>
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-primary/20 sm:left-1/2" />
          {milestones.map((m, i) => (
            <Reveal key={m.year} delay={i * 0.05}>
              <div className={`relative mb-8 flex items-center gap-6 sm:gap-0 ${i % 2 ? 'sm:flex-row-reverse' : ''}`}>
                <div className="ml-10 flex-1 rounded-xl bg-surface p-5 shadow-card sm:ml-0 sm:w-1/2">
                  <span className="text-2xl font-extrabold text-primary">{m.year}</span>
                  <h3 className="mt-1 font-bold">{localized(m, 'title', lang)}</h3>
                  <p className="mt-1 text-sm text-muted">{localized(m, 'desc', lang)}</p>
                </div>
                <span className="absolute left-4 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-4 border-primary bg-white sm:left-1/2" />
                <div className="hidden sm:block sm:w-1/2" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface py-14">
        <div className="container-x">
          <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">{t('about.values')}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="rounded-2xl bg-bg p-6 text-center">
                    <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon size={28} />
                    </span>
                    <h3 className="font-bold">{localized(v, 'title', lang)}</h3>
                    <p className="mt-2 text-sm text-muted">{localized(v, 'desc', lang)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container-x py-14">
        <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">{t('about.process')}</h2>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {process.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="flex flex-col items-center text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                    <Icon size={32} />
                  </span>
                  <span className="mt-3 text-sm font-semibold">{localized(p, 'label', lang)}</span>
                </div>
                {i < process.length - 1 && <span className="hidden text-2xl text-primary/40 sm:block">→</span>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Certificates */}
      <section className="bg-surface py-14">
        <div className="container-x">
          <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">{t('about.certificates')}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {certificates.map((c) => (
              <button
                key={c.id}
                onClick={() => setLightbox(c)}
                className="overflow-hidden rounded-xl shadow-card transition hover:-translate-y-1 hover:shadow-cardHover"
              >
                <img src={c.image} alt={c.title} className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container-x py-14">
        <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">{t('about.team')}</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {team.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.08}>
              <div className="rounded-2xl bg-surface p-5 text-center shadow-card">
                <img src={member.avatar} alt={member.name} className="mx-auto mb-3 h-24 w-24 rounded-full object-cover" />
                <h3 className="font-bold leading-tight">{member.name}</h3>
                <p className="mt-1 text-sm text-muted">{localized(member, 'role', lang)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <StatsBanner />

      <Modal isOpen={!!lightbox} onClose={() => setLightbox(null)} title={lightbox?.title}>
        {lightbox && <img src={lightbox.image} alt={lightbox.title} className="w-full rounded-lg" />}
      </Modal>
    </div>
  );
}

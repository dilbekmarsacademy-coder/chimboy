import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send, Instagram,  MapPin, Phone, Mail } from 'lucide-react';
import Logo from '../ui/Logo';

const socials = [
  { Icon: Instagram, href: 'https://instagram.com/chimboy', label: 'Instagram' },
];

const payments = ['Payme', 'Click', 'Uzcard', 'Humo'];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-16 bg-text text-white/80">
      <div className="container-x grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{t('footer.tagline')}</p>
          <div className="mt-5 flex gap-2.5">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-primary"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-white">{t('footer.quickLinks')}</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/products" className="hover:text-primary">{t('nav.products')}</Link></li>
            <li><Link to="/promotions" className="hover:text-primary">{t('nav.promotions')}</Link></li>
            <li><Link to="/about" className="hover:text-primary">{t('nav.about')}</Link></li>
            <li><Link to="/contact" className="hover:text-primary">{t('nav.contact')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-white">{t('footer.ourStores')}</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/stores" className="hover:text-primary">Toshkent</Link></li>
            <li><Link to="/stores" className="hover:text-primary">Samarqand</Link></li>
            <li><Link to="/stores" className="hover:text-primary">Buxoro</Link></li>
            <li><Link to="/stores" className="hover:text-primary">{t('common.viewAll')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-white">{t('footer.contactUs')}</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
              Toshkent, olmazor tumani Sag'bon-Oqtepa 2 tor 1-berk kuchasi 1 uy
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} className="shrink-0 text-primary" />
              <a href="tel:+998712001001" className="hover:text-primary">+998 94 633 65 97</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} className="shrink-0 text-primary" />
              <a href="mailto:info@chimboy.uz" className="hover:text-primary">info@chimboy.uz</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="text-xs text-white/60">© 2026 Chimboy. {t('footer.rights')}</p>
          <div className="flex items-center gap-2">
            <span className="mr-1 text-xs text-white/60">{t('footer.payments')}:</span>
            {payments.map((p) => (
              <span
                key={p}
                className="rounded bg-white px-2 py-1 text-[11px] font-bold text-text"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

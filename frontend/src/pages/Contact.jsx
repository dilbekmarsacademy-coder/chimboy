import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, Send, Instagram, Facebook, Youtube } from 'lucide-react';
import Button from '../components/ui/Button';
import { isEmail } from '../utils/helpers';

const socials = [
  { Icon: Send, href: 'https://t.me/chimboy_official' },
  { Icon: Instagram, href: 'https://instagram.com/chimboy' },
  { Icon: Facebook, href: 'https://facebook.com/chimboy' },
  { Icon: Youtube, href: 'https://youtube.com/@chimboy' },
];

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const submit = (e) => {
    e.preventDefault();
    if (!isEmail(form.email)) {
      toast.error(t('validation.invalidEmail'));
      return;
    }
    toast.success(t('contact.messageSent'));
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const input =
    'w-full rounded-lg border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15';

  return (
    <div className="container-x py-10">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">{t('contact.title')}</h1>
        <p className="mt-2 text-muted">{t('contact.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form */}
        <form onSubmit={submit} className="rounded-2xl bg-surface p-6 shadow-card">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              required
              className={input}
              placeholder={t('contact.name')}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              required
              className={input}
              placeholder={t('contact.email')}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <input
            required
            className={`${input} mt-4`}
            placeholder={t('contact.subject')}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
          <textarea
            required
            rows={6}
            className={`${input} mt-4`}
            placeholder={t('contact.message')}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <Button type="submit" size="lg" className="mt-4" fullWidth>
            <Send size={18} /> {t('contact.send')}
          </Button>
        </form>

        {/* Info */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-surface p-6 shadow-card">
            <h2 className="mb-4 text-lg font-bold">{t('contact.info')}</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Phone size={18} />
                </span>
                <div>
                  <p className="text-xs text-muted">{t('contact.phone')}</p>
                  <a href="tel:+998712001001" className="font-semibold hover:text-primary">+998 71 200 10 01</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="text-xs text-muted">Email</p>
                  <a href="mailto:info@chimboy.uz" className="font-semibold hover:text-primary">info@chimboy.uz</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="text-xs text-muted">{t('contact.address')}</p>
                  <p className="font-semibold">Toshkent, Bunyodkor ko'chasi 12</p>
                </div>
              </li>
            </ul>

            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">{t('contact.followUs')}</p>
              <div className="flex gap-2">
                {socials.map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="h-56 overflow-hidden rounded-2xl shadow-card">
            <iframe
              title="map"
              className="h-full w-full border-0"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=69.18%2C41.27%2C69.30%2C41.34&layer=mapnik&marker=41.31%2C69.24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

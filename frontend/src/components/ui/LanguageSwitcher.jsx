import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const langs = [
  { code: 'uz', label: 'UZ' },
  { code: 'ru', label: 'RU' },
];

export default function LanguageSwitcher({ className = '' }) {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('ru') ? 'ru' : 'uz';

  return (
    <div className={`inline-flex items-center rounded-full bg-black/5 p-0.5 ${className}`}>
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => i18n.changeLanguage(l.code)}
          className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
            current === l.code ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-text'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

LanguageSwitcher.propTypes = { className: PropTypes.string };

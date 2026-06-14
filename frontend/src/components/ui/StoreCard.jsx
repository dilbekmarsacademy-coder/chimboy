import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Clock } from 'lucide-react';
import { localized } from '../../utils/helpers';

export default function StoreCard({ store, onSelect, active = false }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';

  return (
    <div
      className={`cursor-pointer rounded-xl border p-4 transition-all ${
        active ? 'border-primary bg-primary/5 shadow-card' : 'border-black/5 bg-surface hover:border-primary/40'
      }`}
      onClick={() => onSelect?.(store)}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold leading-tight">{localized(store, 'name', lang)}</h3>
        <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-xs text-muted">
          {localized(store, 'city', lang)}
        </span>
      </div>
      <p className="mt-2 flex items-start gap-2 text-sm text-muted">
        <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
        {localized(store, 'address', lang)}
      </p>
      <p className="mt-1.5 flex items-center gap-2 text-sm text-muted">
        <Clock size={16} className="shrink-0 text-primary" />
        {store.workingHours}
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(store);
          }}
          className="flex-1 rounded-lg border border-primary px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white"
        >
          {t('stores.showOnMap')}
        </button>
        <a
          href={`tel:${store.phone.replace(/\s/g, '')}`}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-dark"
        >
          <Phone size={14} /> {t('stores.call')}
        </a>
      </div>
    </div>
  );
}

StoreCard.propTypes = {
  store: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  active: PropTypes.bool,
};

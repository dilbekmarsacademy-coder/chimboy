import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import StoreCard from '../components/ui/StoreCard';
import StoresMap from '../components/sections/StoresMap';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { getStores, getCities } from '../services/storeService';
import { localized } from '../utils/helpers';

export default function Stores() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';
  const [stores, setStores] = useState([]);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState('all');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCities().then(setCities);
  }, []);

  useEffect(() => {
    setLoading(true);
    getStores(city).then((res) => {
      setStores(res);
      setSelected(res[0] || null);
      setLoading(false);
    });
  }, [city]);

  return (
    <div className="container-x py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold sm:text-3xl">{t('stores.title')}</h1>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-lg border border-black/10 bg-surface px-4 py-2.5 text-sm font-medium outline-none focus:border-primary"
        >
          <option value="all">{t('stores.allCities')}</option>
          {cities.map((c) => (
            <option key={c.city_uz} value={lang === 'ru' ? c.city_ru : c.city_uz}>
              {localized(c, 'city', lang)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : stores.length === 0 ? (
        <EmptyState icon={MapPin} title={t('stores.noStores')} />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* List */}
          <div className="hide-scrollbar order-2 max-h-[600px] space-y-3 overflow-y-auto pr-1 lg:order-1">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                active={selected?.id === store.id}
                onSelect={setSelected}
              />
            ))}
          </div>

          {/* Map */}
          <div className="order-1 h-[400px] overflow-hidden rounded-xl shadow-card lg:order-2 lg:sticky lg:top-28 lg:h-[600px]">
            <StoresMap stores={stores} selected={selected} onSelect={setSelected} />
          </div>
        </div>
      )}
    </div>
  );
}

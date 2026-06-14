import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, LayoutGrid, List, X, PackageSearch } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import Skeleton from '../components/ui/Skeleton';
import RangeSlider from '../components/ui/RangeSlider';
import Toggle from '../components/ui/Toggle';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import useProducts from '../hooks/useProducts';
import { getCategories } from '../services/productService';
import { localized } from '../utils/helpers';

const PRICE_MIN = 0;
const PRICE_MAX = 150000;
const WEIGHTS = ['100', '200', '300', '500', '900', '1000+'];
const WEIGHT_LABELS = { 100: '100g', 200: '200g', 300: '300g', 500: '500g', 900: '900g', '1000+': '1kg+' };
const PAGE_SIZE = 9;

export default function Products() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState('grid');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [mobileFilters, setMobileFilters] = useState(false);

  // Read filters from URL
  const selectedCats = searchParams.getAll('category');
  const selectedWeights = searchParams.getAll('weight');
  const onSale = searchParams.get('sale') === '1';
  const sort = searchParams.get('sort') || 'popular';
  const search = searchParams.get('search') || '';
  const minPrice = Number(searchParams.get('min') || PRICE_MIN);
  const maxPrice = Number(searchParams.get('max') || PRICE_MAX);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const filters = useMemo(
    () => ({
      categories: selectedCats,
      weights: selectedWeights,
      onSale,
      sort,
      search,
      minPrice,
      maxPrice,
    }),
    [selectedCats.join(), selectedWeights.join(), onSale, sort, search, minPrice, maxPrice],
  );

  const { products, loading } = useProducts(filters);

  useEffect(() => setVisible(PAGE_SIZE), [filters]);

  // URL helpers
  const updateParam = (key, value, multi = false) => {
    const next = new URLSearchParams(searchParams);
    if (multi) {
      const values = next.getAll(key);
      next.delete(key);
      if (values.includes(value)) values.filter((v) => v !== value).forEach((v) => next.append(key, v));
      else [...values, value].forEach((v) => next.append(key, v));
    } else if (value == null || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const setPrice = ([lo, hi]) => {
    const next = new URLSearchParams(searchParams);
    next.set('min', lo);
    next.set('max', hi);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => setSearchParams(search ? { search } : {}, { replace: true });

  const activeFilterCount =
    selectedCats.length + selectedWeights.length + (onSale ? 1 : 0) + (minPrice > PRICE_MIN || maxPrice < PRICE_MAX ? 1 : 0);

  const Sidebar = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold">
          <SlidersHorizontal size={18} /> {t('products.filters')}
        </h3>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-xs font-semibold text-primary hover:underline">
            {t('products.clearFilters')}
          </button>
        )}
      </div>

      <div>
        <h4 className="mb-3 text-sm font-bold">{t('products.category')}</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={selectedCats.includes(cat.slug)}
                onChange={() => updateParam('category', cat.slug, true)}
                className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary/40"
              />
              {localized(cat, 'name', lang)}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-bold">{t('products.priceRange')}</h4>
        <RangeSlider min={PRICE_MIN} max={PRICE_MAX} value={[minPrice, maxPrice]} onChange={setPrice} />
      </div>

      <div>
        <h4 className="mb-3 text-sm font-bold">{t('products.weight')}</h4>
        <div className="grid grid-cols-3 gap-2">
          {WEIGHTS.map((w) => (
            <button
              key={w}
              onClick={() => updateParam('weight', w, true)}
              className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                selectedWeights.includes(w)
                  ? 'border-primary bg-primary text-white'
                  : 'border-black/10 hover:border-primary'
              }`}
            >
              {WEIGHT_LABELS[w]}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-black/5 pt-4">
        <Toggle checked={onSale} onChange={(v) => updateParam('sale', v ? '1' : null)} label={t('products.onSaleOnly')} />
      </div>
    </div>
  );

  return (
    <div className="container-x py-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">{t('products.title')}</h1>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28 rounded-xl bg-surface p-5 shadow-card">{Sidebar}</div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* Top bar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface p-3 shadow-card">
            <button
              onClick={() => setMobileFilters(true)}
              className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-semibold lg:hidden"
            >
              <SlidersHorizontal size={16} /> {t('products.filters')}
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <p className="text-sm text-muted">
              {loading ? t('common.loading') : t('products.resultsFound', { count: products.length })}
            </p>

            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-primary"
              >
                <option value="popular">{t('products.sortPopular')}</option>
                <option value="price-low">{t('products.sortPriceLow')}</option>
                <option value="price-high">{t('products.sortPriceHigh')}</option>
                <option value="newest">{t('products.sortNewest')}</option>
              </select>
              <div className="hidden items-center rounded-lg border border-black/10 sm:flex">
                <button
                  onClick={() => setView('grid')}
                  className={`flex h-9 w-9 items-center justify-center rounded-l-lg ${view === 'grid' ? 'bg-primary text-white' : 'text-muted'}`}
                  aria-label="grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`flex h-9 w-9 items-center justify-center rounded-r-lg ${view === 'list' ? 'bg-primary text-white' : 'text-muted'}`}
                  aria-label="list view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="card" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title={t('products.noResults')}
              action={<Button onClick={clearFilters}>{t('products.clearFilters')}</Button>}
            />
          ) : (
            <>
              <div
                className={
                  view === 'grid'
                    ? 'grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3'
                    : 'flex flex-col gap-4'
                }
              >
                {products.slice(0, visible).map((p) => (
                  <ProductCard key={p.id} product={p} view={view} />
                ))}
              </div>
              {visible < products.length && (
                <div className="mt-8 flex justify-center">
                  <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    {t('common.loadMore')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilters(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-surface p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-bold">{t('products.filters')}</span>
              <button onClick={() => setMobileFilters(false)} className="rounded-full p-1 hover:bg-black/5">
                <X size={20} />
              </button>
            </div>
            {Sidebar}
            <Button fullWidth className="mt-6" onClick={() => setMobileFilters(false)}>
              {t('common.apply')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

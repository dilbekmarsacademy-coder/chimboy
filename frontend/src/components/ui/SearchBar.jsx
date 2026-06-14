import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';
import { getProducts } from '../../services/productService';
import { localized } from '../../utils/helpers';

export default function SearchBar({ onClose, autoFocus = true }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query, 300);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    let active = true;
    if (debounced.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    getProducts({ search: debounced }).then((res) => {
      if (active) {
        setResults(res.slice(0, 6));
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [debounced]);

  const go = (id) => {
    navigate(`/products/${id}`);
    onClose?.();
  };

  const submit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${encodeURIComponent(query)}`);
    onClose?.();
  };

  return (
    <div className="w-full">
      <form onSubmit={submit} className="relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('common.search')}
          className="w-full rounded-full border border-black/10 bg-bg py-3 pl-12 pr-12 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {debounced.trim().length >= 2 && (
        <div className="mt-3 overflow-hidden rounded-xl border border-black/5 bg-surface shadow-card">
          {loading && <p className="px-4 py-3 text-sm text-muted">{t('common.loading')}</p>}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-muted">{t('products.noResults')}</p>
          )}
          {!loading &&
            results.map((p) => (
              <button
                key={p.id}
                onClick={() => go(p.id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-bg"
              >
                <img src={p.images[0]} alt="" className="h-10 w-10 rounded object-cover" />
                <span className="flex-1 text-sm font-medium">{localized(p, 'name', lang)}</span>
                <span className="text-xs text-muted">{p.weight}g</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  onClose: PropTypes.func,
  autoFocus: PropTypes.bool,
};

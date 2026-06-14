import PropTypes from 'prop-types';
import { Minus, Plus } from 'lucide-react';
import { clamp } from '../../utils/helpers';

export default function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md' }) {
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const set = (v) => onChange(clamp(v, min, max));

  return (
    <div className="inline-flex items-center rounded-lg border border-black/10">
      <button
        type="button"
        onClick={() => set(value - 1)}
        disabled={value <= min}
        className={`${dim} flex items-center justify-center rounded-l-lg text-text transition hover:bg-black/5 disabled:opacity-40`}
        aria-label="decrease"
      >
        <Minus size={16} />
      </button>
      <span className="w-10 select-none text-center font-semibold">{value}</span>
      <button
        type="button"
        onClick={() => set(value + 1)}
        disabled={value >= max}
        className={`${dim} flex items-center justify-center rounded-r-lg text-text transition hover:bg-black/5 disabled:opacity-40`}
        aria-label="increase"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

QuantitySelector.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md']),
};

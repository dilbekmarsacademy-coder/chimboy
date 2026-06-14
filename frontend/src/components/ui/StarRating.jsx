import PropTypes from 'prop-types';
import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, readonly = true, size = 16 }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(display);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            className={readonly ? 'cursor-default' : 'cursor-pointer transition-transform hover:scale-110'}
            aria-label={`${star} star`}
          >
            <Star
              size={size}
              className={filled ? 'fill-accent text-accent' : 'fill-black/10 text-black/10'}
            />
          </button>
        );
      })}
    </div>
  );
}

StarRating.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  size: PropTypes.number,
};

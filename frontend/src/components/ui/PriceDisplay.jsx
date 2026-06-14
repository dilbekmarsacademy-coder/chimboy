import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../utils/helpers';

export default function PriceDisplay({ price, oldPrice, size = 'md', className = '' }) {
  const { t } = useTranslation();
  const sizes = {
    sm: { now: 'text-lg', old: 'text-xs' },
    md: { now: 'text-lg', old: 'text-sm' },
    lg: { now: 'text-3xl', old: 'text-base' },
  }[size];

  return (
    <div className={`flex flex-wrap items-baseline gap-2 ${className}`}>
      <span className={`font-extrabold text-primary ${sizes.now}`}>
        {formatPrice(price)} <span className="text-xs font-semibold">{t('common.currency')}</span>
      </span>
      {oldPrice && oldPrice > price && (
        <span className={`font-medium text-muted line-through ${sizes.old}`}>
          {formatPrice(oldPrice)}
        </span>
      )}
    </div>
  );
}

PriceDisplay.propTypes = {
  price: PropTypes.number.isRequired,
  oldPrice: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

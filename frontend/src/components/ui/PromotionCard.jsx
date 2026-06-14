import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import Badge from './Badge';
import PriceDisplay from './PriceDisplay';
import CountdownTimer from './CountdownTimer';
import { localized, applyDiscount } from '../../utils/helpers';

export default function PromotionCard({ promotion, product }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';

  const title = localized(promotion, 'title', lang);
  const newPrice = product ? applyDiscount(product.oldPrice || product.price, promotion.discountPercent) : null;
  const oldPrice = product ? product.oldPrice || product.price : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="flex flex-col overflow-hidden rounded-xl bg-surface shadow-card transition-shadow hover:shadow-cardHover"
    >
      <Link to={product ? `/products/${product.id}` : '/promotions'} className="relative block">
        <img
          src={product?.images?.[0] || promotion.bannerImage}
          alt={title}
          className="aspect-[4/3] w-full object-cover"
        />
        <span className="absolute right-3 top-3 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-primary text-white shadow-lg">
          <span className="text-lg font-extrabold leading-none">-{promotion.discountPercent}%</span>
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-bold leading-tight">{title}</h3>
        {product && (
          <div className="mt-2">
            <PriceDisplay price={newPrice} oldPrice={oldPrice} />
          </div>
        )}
        <div className="mt-3 flex items-center gap-2">
          <Badge variant="warning" className="gap-1">
            <Tag size={12} /> {promotion.promoCode}
          </Badge>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-muted">{t('common.endsIn')}</span>
          <CountdownTimer expiresAt={promotion.expiresAt} variant="inline" className="text-primary" />
        </div>
        <Link
          to={product ? `/products/${product.id}` : '/promotions'}
          className="mt-4 rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          {t('common.shopNow')}
        </Link>
      </div>
    </motion.div>
  );
}

PromotionCard.propTypes = {
  promotion: PropTypes.object.isRequired,
  product: PropTypes.object,
};

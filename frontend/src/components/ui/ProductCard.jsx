import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import Badge from './Badge';
import StarRating from './StarRating';
import PriceDisplay from './PriceDisplay';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { localized } from '../../utils/helpers';

export default function ProductCard({ product, view = 'grid' }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const wishlisted = useWishlistStore((s) => s.items.includes(product.id));

  const name = localized(product, 'name', lang);
  const desc = localized(product, 'description', lang);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!product.inStock) return;
    addItem(product);
    toast.success(t('misc.addedToCart'));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    const added = toggleWishlist(product.id);
    toast.success(added ? t('misc.addedToWishlist') : t('misc.removedFromWishlist'));
  };

  const badges = (
    <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
      {product.discount && <Badge variant="sale">-{product.discount}%</Badge>}
      {product.isNew && <Badge variant="new">{t('misc.newBadge')}</Badge>}
      {!product.inStock && <Badge variant="neutral">{t('common.outOfStock')}</Badge>}
    </div>
  );

  const wishlistBtn = (
    <button
      onClick={handleWishlist}
      className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-muted shadow-sm backdrop-blur transition hover:text-primary"
      aria-label="wishlist"
    >
      <Heart size={18} className={wishlisted ? 'fill-primary text-primary' : ''} />
    </button>
  );

  if (view === 'list') {
    return (
      <motion.div layout className="group flex gap-4 rounded-lg bg-surface p-3 shadow-card transition hover:shadow-cardHover">
        <Link to={`/products/${product.id}`} className="relative w-32 shrink-0 sm:w-40">
          {badges}
          <img src={product.images[0]} alt={name} className="aspect-square w-full rounded-lg object-cover" />
        </Link>
        <div className="flex flex-1 flex-col">
          <Link to={`/products/${product.id}`}>
            <h3 className="font-semibold leading-tight transition group-hover:text-primary">{name}</h3>
          </Link>
          <p className="mt-0.5 text-xs text-muted">{product.weight}{product.unit}</p>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{desc}</p>
          <div className="mt-1 flex items-center gap-2">
            <StarRating value={product.rating} />
            <span className="text-xs text-muted">({product.reviewCount})</span>
          </div>
          <div className="mt-auto flex items-center justify-between pt-2">
            <PriceDisplay price={product.price} oldPrice={product.oldPrice} />
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-40"
            >
              <ShoppingCart size={16} /> {t('common.addToCart')}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className="group relative flex flex-col overflow-hidden rounded-lg bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover"
    >
      {badges}
      {wishlistBtn}
      <Link to={`/products/${product.id}`} className="block overflow-hidden">
        <img
          src={product.images[0]}
          alt={name}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <Link to={`/products/${product.id}`}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-tight text-muted transition group-hover:text-primary">
            {name}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-muted">{product.weight}{product.unit}</p>
        <div className="mt-1.5 flex items-center gap-1">
          <StarRating value={product.rating} size={14} />
          <span className="text-xs text-muted">({product.reviewCount})</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <PriceDisplay price={product.price} oldPrice={product.oldPrice} size="sm" />
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition hover:bg-primary-dark disabled:opacity-40"
            aria-label={t('common.addToCart')}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  view: PropTypes.oneOf(['grid', 'list']),
};

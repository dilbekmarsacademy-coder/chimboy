import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Egg, Soup, Droplet, Flame, Salad, Gift, Package } from 'lucide-react';
import { localized } from '../../utils/helpers';

// Explicit icon map keyed by category slug — avoids importing the whole
// lucide-react barrel (which would bundle 1000+ icons and bloat the build).
const ICONS = {
  mayonnaises: Egg,
  ketchups: Soup,
  sauces: Droplet,
  mustard: Flame,
  adjika: Salad,
  'gift-sets': Gift,
};

export default function CategoryCard({ category }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';
  const Icon = ICONS[category.slug] || Package;

  return (
    <motion.div whileHover={{ y: -4 }}>
      <Link
        to={`/products?category=${category.slug}`}
        className="group flex flex-col items-center gap-3 rounded-xl bg-surface p-5 text-center shadow-card transition-all duration-300 hover:shadow-cardHover"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
          <Icon size={28} strokeWidth={1.75} />
        </span>
        <span className="text-sm font-semibold leading-tight">{localized(category, 'name', lang)}</span>
      </Link>
    </motion.div>
  );
}

CategoryCard.propTypes = { category: PropTypes.object.isRequired };

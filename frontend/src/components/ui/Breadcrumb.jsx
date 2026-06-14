import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm text-muted" aria-label="breadcrumb">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {item.href && !last ? (
              <Link to={item.href} className="transition hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className={last ? 'font-semibold text-text' : ''}>{item.label}</span>
            )}
            {!last && <ChevronRight size={14} className="text-black/30" />}
          </span>
        );
      })}
    </nav>
  );
}

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, href: PropTypes.string }),
  ).isRequired,
};

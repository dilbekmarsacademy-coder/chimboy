import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeading({ title, subtitle, viewAllLink, viewAllLabel }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:gap-2"
        >
          {viewAllLabel}
          <ArrowRight size={16} className="transition-all group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

SectionHeading.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  viewAllLink: PropTypes.string,
  viewAllLabel: PropTypes.string,
};

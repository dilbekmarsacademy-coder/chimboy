import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Logo({ className = '', light = false }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="Chimboy">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg font-extrabold text-white shadow-sm">
        C
      </span>
      <span className={`text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-text'}`}>
        Chim<span className="text-primary">boy</span>
      </span>
    </Link>
  );
}

Logo.propTypes = {
  className: PropTypes.string,
  light: PropTypes.bool,
};

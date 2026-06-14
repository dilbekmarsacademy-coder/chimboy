import PropTypes from 'prop-types';

export default function Spinner({ size = 'md', className = '' }) {
  const dim = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-[3px]', lg: 'h-12 w-12 border-4' }[size];
  return (
    <span
      role="status"
      aria-label="loading"
      className={`inline-block animate-spin rounded-full border-primary border-t-transparent ${dim} ${className}`}
    />
  );
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

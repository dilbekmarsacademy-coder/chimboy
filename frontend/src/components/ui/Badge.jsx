import PropTypes from 'prop-types';

const variants = {
  sale: 'bg-danger text-white',
  new: 'bg-success text-white',
  limited: 'bg-accent text-text',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-black/5 text-muted',
};

export default function Badge({ variant = 'neutral', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  variant: PropTypes.oneOf([
    'sale',
    'new',
    'limited',
    'success',
    'warning',
    'danger',
    'info',
    'neutral',
  ]),
  className: PropTypes.string,
  children: PropTypes.node,
};

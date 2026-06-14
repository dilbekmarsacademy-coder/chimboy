import PropTypes from 'prop-types';

export default function Skeleton({ variant = 'text', className = '' }) {
  const base = 'animate-pulse bg-black/10 rounded';
  if (variant === 'card') {
    return (
      <div className={`rounded-lg bg-surface p-3 shadow-card ${className}`}>
        <div className={`${base} mb-3 aspect-square w-full`} />
        <div className={`${base} mb-2 h-4 w-3/4`} />
        <div className={`${base} mb-3 h-3 w-1/2`} />
        <div className={`${base} h-9 w-full`} />
      </div>
    );
  }
  if (variant === 'image') {
    return <div className={`${base} aspect-square w-full ${className}`} />;
  }
  return <div className={`${base} h-4 w-full ${className}`} />;
}

Skeleton.propTypes = {
  variant: PropTypes.oneOf(['text', 'card', 'image']),
  className: PropTypes.string,
};

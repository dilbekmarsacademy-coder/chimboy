import PropTypes from 'prop-types';

export default function Card({ hoverable = false, className = '', children, ...props }) {
  return (
    <div
      className={`rounded-lg bg-surface shadow-card ${
        hoverable ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  hoverable: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

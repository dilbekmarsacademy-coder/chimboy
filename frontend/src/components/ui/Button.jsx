import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
  secondary: 'bg-text text-white hover:bg-black',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-text hover:bg-black/5',
  accent: 'bg-accent text-white hover:brightness-95 shadow-sm',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  as = 'button',
  to,
  href,
  className = '',
  children,
  fullWidth = false,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/40 ${
    variants[variant]
  } ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  const Tag = as;
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'accent']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  as: PropTypes.string,
  to: PropTypes.string,
  href: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  fullWidth: PropTypes.bool,
};

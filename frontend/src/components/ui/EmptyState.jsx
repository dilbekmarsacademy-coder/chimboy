import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, message, action, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center px-4 py-16 text-center ${className}`}
    >
      {Icon && (
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon size={36} strokeWidth={1.5} />
        </div>
      )}
      {title && <h3 className="mb-2 text-xl font-bold">{title}</h3>}
      {message && <p className="mb-6 max-w-sm text-muted">{message}</p>}
      {action}
    </motion.div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string,
  message: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
};

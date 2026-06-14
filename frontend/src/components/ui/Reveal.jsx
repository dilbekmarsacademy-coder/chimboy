import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// Fade-up on scroll into view. Use `delay` to stagger.
export default function Reveal({ children, delay = 0, className = '', y = 24 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

Reveal.propTypes = {
  children: PropTypes.node,
  delay: PropTypes.number,
  className: PropTypes.string,
  y: PropTypes.number,
};

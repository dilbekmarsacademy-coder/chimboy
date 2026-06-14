import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const prevFocus = document.activeElement;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
        return;
      }
      // Trap Tab within the modal so focus can't escape to the page behind.
      if (e.key === 'Tab' && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll(FOCUSABLE);
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // Move focus into the modal on open.
    const id = setTimeout(() => {
      const target = panelRef.current?.querySelector(FOCUSABLE) || panelRef.current;
      target?.focus();
    }, 50);

    return () => {
      clearTimeout(id);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (prevFocus instanceof HTMLElement) prevFocus.focus();
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'dialog'}
            tabIndex={-1}
            className={`relative z-10 w-full ${maxWidth} rounded-2xl bg-surface p-6 shadow-2xl focus:outline-none`}
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          >
            {(title || onClose) && (
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">{title}</h3>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-muted transition hover:bg-black/5 hover:text-text"
                  aria-label="close"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
  maxWidth: PropTypes.string,
};

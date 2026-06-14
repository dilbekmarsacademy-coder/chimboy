import PropTypes from 'prop-types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageGallery({ images = [], alt = '' }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false });

  if (!images.length) return null;

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ x, y, on: true });
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-square overflow-hidden rounded-xl border border-black/5 bg-surface"
        onMouseMove={onMove}
        onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="h-full w-full object-cover transition-transform duration-200"
            style={{
              transform: zoom.on ? 'scale(1.8)' : 'scale(1)',
              transformOrigin: `${zoom.x}% ${zoom.y}%`,
            }}
          />
        </AnimatePresence>
      </div>

      <div className="flex gap-2.5">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-20 ${
              active === i ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`${alt} ${i + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  alt: PropTypes.string,
};

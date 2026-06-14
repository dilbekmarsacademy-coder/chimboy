// Simulate network latency for mock services
export const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// Format a number as UZS currency string, e.g. 125000 -> "125 000"
export const formatPrice = (value) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('ru-RU').format(Math.round(value));
};

// Compute discounted price from old price + percent
export const applyDiscount = (price, discountPercent) => {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100));
};

// Localized field helper: pick `${field}_${lang}` falling back to uz
export const localized = (obj, field, lang) => {
  if (!obj) return '';
  return obj[`${field}_${lang}`] ?? obj[`${field}_uz`] ?? '';
};

// Generate a random order number like CH-2024-4821
export const generateOrderNumber = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CH-${year}-${rand}`;
};

// Clamp a number between min and max
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// --- Lightweight validators (return true when valid) ---
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());

// Uzbek phone: accepts optional +998 and 9 digits, ignoring spaces/dashes
export const isPhone = (v) => {
  const digits = String(v || '').replace(/[^\d]/g, '');
  return digits.length === 9 || (digits.length === 12 && digits.startsWith('998'));
};

export const isCardNumber = (v) => String(v || '').replace(/\s/g, '').length === 16;
export const isExpiry = (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(String(v || '').trim());
export const isCvv = (v) => /^\d{3}$/.test(String(v || '').trim());

// Slugify a string
export const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

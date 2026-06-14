import { delay } from '../utils/helpers';
import { promotions, promoCodes } from './mockData';

export const getPromotions = async (type = 'all') => {
  await delay(600);
  if (type === 'all') return promotions;
  return promotions.filter((p) => p.type === type);
};

export const getActivePromotions = async (limit = 4) => {
  await delay(500);
  return [...promotions]
    .sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt))
    .slice(0, limit);
};

// Validate a promo code → returns discount percent or null
export const validatePromoCode = async (code) => {
  await delay(400);
  const normalized = String(code || '').trim().toUpperCase();
  return promoCodes[normalized] ?? null;
};

import { delay } from '../utils/helpers';
import { stores } from './mockData';

export const getStores = async (city = null) => {
  await delay(600);
  if (!city || city === 'all') return stores;
  return stores.filter((s) => s.city_uz === city || s.city_ru === city);
};

// Unique cities for the filter dropdown
export const getCities = async () => {
  await delay(300);
  const seen = new Set();
  const list = [];
  stores.forEach((s) => {
    if (!seen.has(s.city_uz)) {
      seen.add(s.city_uz);
      list.push({ city_uz: s.city_uz, city_ru: s.city_ru });
    }
  });
  return list;
};

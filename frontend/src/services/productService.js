// Product data service. Returns Promises with simulated latency so it can be
// swapped for real API calls later without changing component code.
import { delay } from '../utils/helpers';
import { products, categories, reviews } from './mockData';

export const getProducts = async (filters = {}) => {
  await delay(700);
  let result = [...products];

  const { category, categories: cats, minPrice, maxPrice, weights, onSale, search, sort } = filters;

  if (category) result = result.filter((p) => p.category === category);
  if (cats && cats.length) result = result.filter((p) => cats.includes(p.category));
  if (minPrice != null) result = result.filter((p) => p.price >= minPrice);
  if (maxPrice != null) result = result.filter((p) => p.price <= maxPrice);
  if (onSale) result = result.filter((p) => !!p.discount);
  if (weights && weights.length) {
    result = result.filter((p) => weights.some((w) => matchWeight(p.weight, w)));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name_uz.toLowerCase().includes(q) ||
        p.name_ru.toLowerCase().includes(q) ||
        p.category.includes(q),
    );
  }

  switch (sort) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      result.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id);
      break;
    default:
      result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  }

  return result;
};

const matchWeight = (weight, bucket) => {
  switch (bucket) {
    case '100':
      return weight <= 100;
    case '200':
      return weight > 100 && weight <= 200;
    case '300':
      return weight > 200 && weight <= 300;
    case '500':
      return weight > 300 && weight <= 500;
    case '900':
      return weight > 500 && weight <= 900;
    case '1000+':
      return weight >= 1000;
    default:
      return true;
  }
};

export const getProductById = async (id) => {
  await delay(600);
  return products.find((p) => p.id === Number(id)) || null;
};

export const getProductBySlug = async (slug) => {
  await delay(600);
  return products.find((p) => p.slug === slug) || null;
};

export const getFeaturedProducts = async (limit = 8) => {
  await delay(600);
  return products.filter((p) => p.isFeatured).slice(0, limit);
};

export const getRelatedProducts = async (productId, limit = 4) => {
  await delay(500);
  const product = products.find((p) => p.id === Number(productId));
  if (!product) return [];
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
};

export const getCategories = async () => {
  await delay(400);
  return categories;
};

export const getReviewsByProduct = async (productId) => {
  await delay(500);
  return reviews.filter((r) => r.productId === Number(productId));
};

export const getProductsByIds = async (ids = []) => {
  await delay(400);
  return products.filter((p) => ids.includes(p.id));
};

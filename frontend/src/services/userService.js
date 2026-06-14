import { delay } from '../utils/helpers';
import { mockOrders, pointsHistory } from './mockData';

const MOCK_PASSWORD = 'chimboy123';

export const login = async ({ email, password }) => {
  await delay(700);
  if (password === MOCK_PASSWORD && email) {
    return {
      id: 1,
      name: email.split('@')[0] || 'Foydalanuvchi',
      email,
      phone: '+998 90 123 45 67',
      bonusPoints: 278,
    };
  }
  throw new Error('INVALID_CREDENTIALS');
};

export const register = async ({ firstName, lastName, email, phone }) => {
  await delay(800);
  return {
    id: Date.now(),
    name: `${firstName} ${lastName}`.trim(),
    email,
    phone,
    bonusPoints: 50, // welcome bonus
  };
};

export const getOrders = async () => {
  await delay(600);
  return mockOrders;
};

export const getPointsHistory = async () => {
  await delay(500);
  return pointsHistory;
};

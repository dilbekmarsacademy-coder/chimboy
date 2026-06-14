import { delay } from '../utils/helpers';
import { heroSlides, news, stats, milestones, team, certificates } from './mockData';

export const getHeroSlides = async () => {
  await delay(300);
  return heroSlides;
};

export const getNews = async (limit) => {
  await delay(500);
  return limit ? news.slice(0, limit) : news;
};

export const getStats = async () => {
  await delay(300);
  return stats;
};

export const getMilestones = async () => {
  await delay(400);
  return milestones;
};

export const getTeam = async () => {
  await delay(400);
  return team;
};

export const getCertificates = async () => {
  await delay(400);
  return certificates;
};

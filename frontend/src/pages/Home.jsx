import HeroSlider from '../components/sections/HeroSlider';
import DealsStrip from '../components/sections/DealsStrip';
import CategoriesGrid from '../components/sections/CategoriesGrid';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import StatsBanner from '../components/sections/StatsBanner';
import LatestNews from '../components/sections/LatestNews';

export default function Home() {
  return (
    <>
      <HeroSlider />
      <DealsStrip />
      <CategoriesGrid />
      <FeaturedProducts />
      <StatsBanner />
      <LatestNews />
    </>
  );
}

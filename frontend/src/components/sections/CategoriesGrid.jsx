import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeading from '../ui/SectionHeading';
import CategoryCard from '../ui/CategoryCard';
import Reveal from '../ui/Reveal';
import { getCategories } from '../../services/productService';

export default function CategoriesGrid() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <section className="bg-surface py-12">
      <div className="container-x">
        <SectionHeading title={t('home.categories')} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.06}>
              <CategoryCard category={cat} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

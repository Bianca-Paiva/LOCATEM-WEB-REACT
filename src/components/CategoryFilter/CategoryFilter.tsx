import React, { useState } from 'react';
import styles from './CategoryFilter.module.css';

const CATEGORIES = [
  'Construção Civil',
  'Reformas e Manutenção',
  'Jardim e Paisagismo',
  'Pintura e Acabamento',
  'Transporte',
  'Ferramentas Elétricas',
  'Corte e Desgaste'
];

export const CategoryFilter: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Construção Civil');

  return (
    <div className={styles.categoriesWrapper}>
      <h2 className={styles.sectionTitle}>Ferramentas</h2>
      <div className={styles.categoriesContainer}>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`${styles.categoryPill} ${activeCategory === category ? styles.active : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
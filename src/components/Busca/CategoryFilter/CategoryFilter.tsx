import React from 'react';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
  categorias: string[];
  categoriaSelecionada: string;
  onSelecionarCategoria: (categoria: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categorias,
  categoriaSelecionada,
  onSelecionarCategoria,
}) => {
  return (
    <div className={styles.categoriesWrapper}>
      <h2 className={styles.sectionTitle}>Ferramentas</h2>
      <div className={styles.categoriesContainer}>
        {categorias.map((category) => (
          <button
            key={category}
            className={`${styles.categoryPill} ${categoriaSelecionada === category ? styles.active : ''}`}
            onClick={() => onSelecionarCategoria(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
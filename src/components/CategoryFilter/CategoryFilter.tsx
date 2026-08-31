import React, { useMemo, useState } from 'react';
import { useCatalogoStore } from '../../hooks/useCatalogoStore';
import { derivarCategorias } from '../../utils/categorias';
import styles from './CategoryFilter.module.css';

export const CategoryFilter: React.FC = () => {
  const { produtos } = useCatalogoStore();

  // Categorias derivadas do catálogo real (mesma fonte usada pelos filtros da Busca), em vez de uma lista fixa que podia divergir das ferramentas realmente cadastradas.
  const categorias = useMemo(
    () => derivarCategorias(produtos).map((c) => c.categoria),
    [produtos],
  );

  const [activeCategory, setActiveCategory] = useState<string>('');

  // Mantém uma categoria selecionada assim que o catálogo carrega, sem sobrescrever uma escolha que o usuário já tenha feito.
  if (!activeCategory && categorias.length > 0) {
    setActiveCategory(categorias[0]);
  }

  return (
    <div className={styles.categoriesWrapper}>
      <h2 className={styles.sectionTitle}>Ferramentas</h2>
      <div className={styles.categoriesContainer}>
        {categorias.map((category) => (
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
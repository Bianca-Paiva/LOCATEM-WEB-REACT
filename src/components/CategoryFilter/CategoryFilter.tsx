import React, { useState } from 'react';
import './CategoryFilter.css';

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
    <div className="categories-wrapper">
      <h2 className="section-title">Ferramentas</h2>
      <div className="categories-container">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            className={`category-pill ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
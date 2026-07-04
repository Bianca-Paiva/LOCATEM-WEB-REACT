// src/components/Pagination/Pagination.tsx
import React from 'react';
import './Paginacao.css';

// 1. Definimos a tipagem das propriedades que o componente vai receber
interface PaginacaoProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void; // Função que recebe um número e não retorna nada (void)
}

// 2. Usamos React.FC (Functional Component) e passamos a interface
const Paginacao: React.FC<PaginacaoProps> = ({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange 
}) => {
  // CÁLCULO AUTOMÁTICO: Arredonda para cima. Ex: 25 itens / 10 por página = 3 páginas.
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Se não houver itens ou tiver apenas 1 página, não renderiza a paginação
  if (totalPages <= 1) return null;

  // Funções de navegação
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a tela suavemente
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Sobe a tela suavemente
    }
  };

  // Gera um array com o número das páginas para os botões [1] [2] [3]
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const renderPageNumbers = () => {
  const pages = [];

  pages.push(1);

  if (currentPage > 4) {
    pages.push('...');
  }

  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  ) {
    pages.push(i);
  }

  if (currentPage < totalPages - 3) {
    pages.push('...');
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages.map((item, index) =>
    item === '...' ? (
      <span key={`dots-${index}`} className="page-dots">
        ...
      </span>
    ) : (
      <button
        key={item}
        className={`page-btn page-number-btn ${
          currentPage === item ? 'active' : ''
        }`}
        onClick={() => {
          onPageChange(Number(item));
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }}
      >
        {item}
      </button>
    )
  );
};

  return (
    <div className="paginacao-wrapper">
      {/* Botão Anterior */}

            <button
        className="page-btn"
        onClick={() => onPageChange(Math.max(1, currentPage - 5))}
      >
        &laquo;&laquo;
      </button>
      <button 
        className="page-btn" 
        onClick={handlePrev} 
        disabled={currentPage === 1}
      >
        &laquo; Anterior
      </button>

      {/* Visão Mobile: Mostra "Página X de Y" */}
      <span className="page-info-mobile">
        Página {currentPage} de {totalPages}
      </span>

{renderPageNumbers()}

      {/* Botão Próximo */}
      <button 
        className="page-btn" 
        onClick={handleNext} 
        disabled={currentPage === totalPages}
      >
        Próxima &raquo;
      </button>

      <button
  className="page-btn"
  onClick={() =>
    onPageChange(Math.min(totalPages, currentPage + 5))
  }
>
  &raquo;&raquo;
</button>
    </div>
  );
};

export default Paginacao;
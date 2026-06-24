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

  return (
    <div className="paginacao-wrapper">
      {/* Botão Anterior */}
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

      {/* Visão Desktop/Tablet: Mostra os números [1] [2] [3] */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          className={`page-btn page-number-btn ${currentPage === number ? 'active' : ''}`}
          onClick={() => {
            onPageChange(number);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {number}
        </button>
      ))}

      {/* Botão Próximo */}
      <button 
        className="page-btn" 
        onClick={handleNext} 
        disabled={currentPage === totalPages}
      >
        Próxima &raquo;
      </button>
    </div>
  );
};

export default Paginacao;
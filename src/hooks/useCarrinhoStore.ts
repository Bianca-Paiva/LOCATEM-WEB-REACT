import { useContext } from 'react';
import { CarrinhoContext } from '../context/CarrinhoContext';

export function useCarrinhoStore() {
  const ctx = useContext(CarrinhoContext);

  if (!ctx) {
    throw new Error('useCarrinhoStore deve ser usado dentro de CarrinhoProvider');
  }

  return ctx;
}

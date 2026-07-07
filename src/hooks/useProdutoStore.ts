import { useContext } from 'react';
import { ProdutoContext } from '../context/ProdutoContext';

export function useProdutoStore() {
  const ctx = useContext(ProdutoContext);

  if (!ctx) {
    throw new Error(
      'useProdutoStore deve ser usado dentro de ProdutoProvider'
    );
  }

  return ctx;
}
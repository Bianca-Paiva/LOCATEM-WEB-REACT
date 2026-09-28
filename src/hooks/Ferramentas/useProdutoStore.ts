/**
 * Acesso ao produto selecionado no fluxo de catálogo/detalhe.
 */
import { useContext } from 'react';
import { ProdutoContext } from '../../context/Ferramentas/Produto/ProdutoContext';

export function useProdutoStore() {
  const ctx = useContext(ProdutoContext);

  if (!ctx) {
    throw new Error(
      'useProdutoStore deve ser usado dentro de ProdutoProvider'
    );
  }

  return ctx;
}

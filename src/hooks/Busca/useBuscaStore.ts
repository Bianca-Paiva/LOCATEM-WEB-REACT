import { useContext } from 'react';
import { BuscaContext } from '../../context/Busca/BuscaContext';

export function useBuscaStore() {
  const ctx = useContext(BuscaContext);

  if (!ctx) {
    throw new Error('useBuscaStore deve ser usado dentro de BuscaProvider');
  }

  return ctx;
}

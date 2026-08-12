import { useContext } from 'react';
import { CatalogoContext } from '../context/CatalogoContext';

export function useCatalogoStore() {
  const ctx = useContext(CatalogoContext);

  if (!ctx) {
    throw new Error('useCatalogoStore deve ser usado dentro de CatalogoProvider');
  }

  return ctx;
}

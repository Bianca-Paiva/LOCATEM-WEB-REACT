/**
 * Acesso ao catálogo em memória usado pelas telas mockadas.
 */
import { useContext } from 'react';
import { CatalogoContext } from '../../context/Ferramentas/Catalago/CatalogoContext';

export function useCatalogoStore() {
  const ctx = useContext(CatalogoContext);

  if (!ctx) {
    throw new Error('useCatalogoStore deve ser usado dentro de CatalogoProvider');
  }

  return ctx;
}

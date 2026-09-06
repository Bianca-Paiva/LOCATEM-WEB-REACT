import { useContext } from 'react';
import { LocacaoContext } from '../../context/Locacao/LocacaoContext';

export function useLocacaoStore() {
  const ctx = useContext(LocacaoContext);

  if (!ctx) {
    throw new Error(
      'useLocacaoStore deve ser usado dentro de LocacaoProvider'
    );
  }

  return ctx;
}
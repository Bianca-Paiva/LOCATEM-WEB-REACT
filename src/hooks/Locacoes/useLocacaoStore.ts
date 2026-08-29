import { useContext } from 'react';
import { LocacaoContext } from '../../context/LocacaoContext';

export function useLocacaoStore() {
  const ctx = useContext(LocacaoContext);

  if (!ctx) {
    throw new Error(
      'useLocacaoStore deve ser usado dentro de LocacaoProvider'
    );
  }

  return ctx;
}
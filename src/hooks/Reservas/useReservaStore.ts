import { useContext } from 'react';
import { ReservaContext } from '../../context/ReservaContext';

export function useReservaStore() {
  const ctx = useContext(ReservaContext);

  if (!ctx) {
    throw new Error(
      'useReservaStore deve ser usado dentro de ReservaProvider'
    );
  }

  return ctx;
}
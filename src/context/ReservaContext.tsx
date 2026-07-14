import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ReservaData } from '../pages/Reservas/MinhasReservas/MinhasReservas.types';

interface ReservaContextType {
  reservaSelecionada: ReservaData | null;
  setReservaSelecionada: (reserva: ReservaData) => void;
}

export const ReservaContext = createContext<ReservaContextType | null>(null);

export function ReservaProvider({ children }: { children: ReactNode }) {
  const [reservaSelecionada, setReservaSelecionada] =
    useState<ReservaData | null>(null);

  return (
    <ReservaContext.Provider
      value={{ reservaSelecionada, setReservaSelecionada }}
    >
      {children}
    </ReservaContext.Provider>
  );
}

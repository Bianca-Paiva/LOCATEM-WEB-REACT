import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ReservaData } from '../pages/Reservas/MinhasReservas/MinhasReservas.types';
import { mockReservas } from '../pages/Reservas/MinhasReservas/MinhasReservas.mock';

interface ReservaContextType {
  reservas: ReservaData[];
  reservaSelecionada: ReservaData | null;
  setReservaSelecionada: (reserva: ReservaData) => void;
  atualizarReserva: (id: string, dadosAtualizados: Partial<ReservaData>) => void;
}

export const ReservaContext = createContext<ReservaContextType | null>(null);

export function ReservaProvider({ children }: { children: ReactNode }) {
  // Fonte única de verdade de todas as reservas (futuramente virá da API)
  const [reservas, setReservas] = useState<ReservaData[]>(mockReservas);
  const [reservaSelecionada, setReservaSelecionada] = useState<ReservaData | null>(null);

  // Atualiza uma reserva na lista e, se for a mesma, também na reserva selecionada
  const atualizarReserva = (id: string, dadosAtualizados: Partial<ReservaData>) => {
    setReservas((atuais) =>
      atuais.map((reserva) =>
        reserva.id === id ? { ...reserva, ...dadosAtualizados } : reserva
      )
    );

    setReservaSelecionada((atual) =>
      atual && atual.id === id ? { ...atual, ...dadosAtualizados } : atual
    );
  };

  return (
    <ReservaContext.Provider
      value={{ reservas, reservaSelecionada, setReservaSelecionada, atualizarReserva }}
    >
      {children}
    </ReservaContext.Provider>
  );
}
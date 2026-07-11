import { useMemo, useState } from 'react';
import type { FiltroReserva, ReservaData, StatusReserva } from '../../pages/MinhasReservas/MinhasReservas.types';
import { mockReservas } from '../../pages/MinhasReservas/MinhasReservas.mock';

interface UseMinhasReservasReturn {
  reservasFiltradas: ReservaData[];
  filtro: FiltroReserva;
  setFiltro: (filtro: FiltroReserva) => void;
  contagem: Record<FiltroReserva, number>;
}

export function useMinhasReservas(): UseMinhasReservasReturn {
  // Fonte da verdade: todas as reservas, sem filtro de status
  const [reservas] = useState<ReservaData[]>(mockReservas);
  const [filtro, setFiltro] = useState<FiltroReserva>('todas');

  // Contagem de reservas por status, usada nos badges das abas
  const contagem = useMemo(() => {
    const base: Record<FiltroReserva, number> = {
      todas: reservas.length,
      pendente: 0,
      aprovada: 0,
      recusada: 0,
      cancelada: 0,
    };

    reservas.forEach((reserva) => {
      base[reserva.status] += 1;
    });

    return base;
  }, [reservas]);

  // Lista já filtrada pela aba selecionada
  const reservasFiltradas = useMemo(() => {
    if (filtro === 'todas') return reservas;
    return reservas.filter((reserva) => reserva.status === (filtro as StatusReserva));
  }, [reservas, filtro]);

  return {
    reservasFiltradas,
    filtro,
    setFiltro,
    contagem,
  };
}

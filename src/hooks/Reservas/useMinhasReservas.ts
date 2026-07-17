import { useMemo, useState } from 'react';
import type { FiltroReserva, StatusReserva } from '../../pages/Reservas/MinhasReservas/MinhasReservas.types';
import { useReservaStore } from './useReservaStore';

interface UseMinhasReservasReturn {
  reservasFiltradas: ReturnType<typeof useReservaStore>['reservas'];
  filtro: FiltroReserva;
  setFiltro: (filtro: FiltroReserva) => void;
  contagem: Record<FiltroReserva, number>;
}

export function useMinhasReservas(): UseMinhasReservasReturn {
  // Reservas vêm do contexto global, garantindo que alterações feitas em
  // DetalhesReserva (ex: cancelamento) reflitam aqui também
  const { reservas } = useReservaStore();
  const [filtro, setFiltro] = useState<FiltroReserva>('todas');

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
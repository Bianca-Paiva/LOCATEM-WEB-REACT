import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { ReservaData } from '../pages/Reservas/MinhasReservas/MinhasReservas.types';
import { mockReservas } from '../pages/Reservas/MinhasReservas/MinhasReservas.mock';

interface ReservaContextType {
  reservas: ReservaData[];
  reservaSelecionada: ReservaData | null;
  setReservaSelecionada: (reserva: ReservaData) => void;
  atualizarReserva: (id: string, dadosAtualizados: Partial<ReservaData>) => void;
  adicionarReserva: (dadosReserva: Omit<ReservaData, 'id'>) => ReservaData;
}

export const ReservaContext = createContext<ReservaContextType | null>(null);

// Mensagem exibida (na listagem e nos detalhes) quando o prazo de pagamento
// expira sem o pagamento ser efetuado
const MENSAGEM_CANCELAMENTO_AUTOMATICO =
  'Reserva cancelada automaticamente por falta de pagamento dentro do prazo.';

// Frequência de verificação do prazo de pagamento das reservas
const INTERVALO_VERIFICACAO_MS = 60 * 1000; // 1 minuto

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

  // Cria uma nova reserva (fluxo de Solicitar Reserva) e a insere no topo da lista
  const adicionarReserva = (dadosReserva: Omit<ReservaData, 'id'>): ReservaData => {
    const novaReserva: ReservaData = {
      ...dadosReserva,
      id: `r-${Date.now()}`,
    };

    setReservas((atuais) => [novaReserva, ...atuais]);

    return novaReserva;
  };

  // Verifica periodicamente se alguma reserva "Aguardando pagamento" teve seu
  // prazo expirado e, se sim, cancela automaticamente — atualizando tanto o
  // status quanto a mensagem exibida na listagem e nos detalhes da reserva.
  useEffect(() => {
    const cancelarReservasComPagamentoVencido = () => {
      const agora = Date.now();

      const prazoExpirou = (reserva: ReservaData) =>
        reserva.status === 'aguardandoPagamento' &&
        !!reserva.prazoPagamento &&
        agora > new Date(reserva.prazoPagamento).getTime();

      const cancelarSeVencida = (reserva: ReservaData): ReservaData =>
        prazoExpirou(reserva)
          ? {
              ...reserva,
              status: 'cancelada',
              mensagemStatus: MENSAGEM_CANCELAMENTO_AUTOMATICO,
              motivoCancelamento: MENSAGEM_CANCELAMENTO_AUTOMATICO,
            }
          : reserva;

      setReservas((atuais) => atuais.map(cancelarSeVencida));
      setReservaSelecionada((atual) => (atual ? cancelarSeVencida(atual) : atual));
    };

    cancelarReservasComPagamentoVencido(); // verifica imediatamente ao montar
    const intervalo = setInterval(cancelarReservasComPagamentoVencido, INTERVALO_VERIFICACAO_MS);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <ReservaContext.Provider
      value={{ reservas, reservaSelecionada, setReservaSelecionada, atualizarReserva, adicionarReserva }}
    >
      {children}
    </ReservaContext.Provider>
  );
}
import type { NotificationData } from './Notificacoes.types';

// Mock de notificações. "details" contém dados fictícios até integração com API real.
export const mockNotifications: NotificationData[] = [
  {
    id: '1',
    type: 'success',
    category: 'reserva-confirmada',
    title: 'Reserva Confirmada',
    description: 'Sua reserva da Lixadeira Bosch foi confirmada.',
    timestamp: '04/07/2026 às 10h15',
    date: '2026-07-04T10:15:00',
    details: {
      equipamento: 'Lixadeira Bosch GEX 125-1 AE',
      status: 'Confirmada',
      dataConfirmacao: '04/07/2026 às 10h15',
      periodoLocacao: '05/07/2026 a 08/07/2026 (3 dias)',
      valor: 'R$ 89,90',
      formaPagamento: 'Cartão de crédito •••• 4521',
    },
  },
  {
    id: '2',
    type: 'warning',
    category: 'devolucao-pendente',
    title: 'Devolução Pendente',
    description: 'A devolução da Betoneira deve ser feita amanhã.',
    timestamp: '03/07/2026 às 17h00',
    date: '2026-07-03T17:00:00',
    showRenovar: true,
    details: {
      equipamento: 'Betoneira 400L CSM',
      status: 'Pendente',
      dataLimite: '05/07/2026 às 18h00',
    },
  },
  {
    id: '3',
    type: 'delivery',
    category: 'entrega-andamento',
    title: 'Entrega em Andamento',
    description: 'A Serra Circular Makita está a caminho.',
    timestamp: '',
    date: '2026-07-04T13:00:00',
    extraInfo: 'Tempo estimado de chegada: Hoje às 15:00',
    details: {
      equipamento: 'Serra Circular Makita 5007NB',
      statusEntrega: 'Saiu para entrega',
      previsaoChegada: 'Hoje às 15:00',
    },
  },
  {
    id: '4',
    type: 'success',
    category: 'ferramenta-devolvida',
    title: 'Ferramenta Devolvida',
    description: 'A devolução da Parafusadeira Dewalt foi registrada.',
    timestamp: '01/07/2026 às 09h40',
    date: '2026-07-01T09:40:00',
    details: {
      equipamento: 'Parafusadeira Dewalt DCF680N',
      status: 'Devolvida sem avarias',
      dataDevolucao: '01/07/2026 às 09h40',
    },
  },
  {
    id: '5',
    type: 'warning',
    category: 'pagamento-pendente',
    title: 'Pagamento Pendente',
    description: 'O pagamento da locação da Betoneira ainda não foi confirmado.',
    timestamp: '20/06/2026 às 14h20',
    date: '2026-06-20T14:20:00',
    showRenovar: true,
    details: {
      equipamento: 'Betoneira 400L CSM',
      statusPagamento: 'Aguardando confirmação',
      valor: 'R$ 145,00',
    },
  },
];

export const PAGE_SIZE = 3;
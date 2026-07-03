import type { NotificationData } from './Notificacoes.types';

export const mockNotifications: NotificationData[] = [
  {
    id: '1',
    type: 'success',
    title: 'Reserva Confirmada',
    description: 'Sua reserva da Lixadeira Bosch foi confirmada.',
    timestamp: '03/07/2026 às 10h15',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Devolução Pendente',
    description: 'A devolução da Betoneira deve ser feita amanhã.',
    timestamp: '30/09/2026 às 17h00',
    showRenovar: true,
  },
  {
    id: '3',
    type: 'delivery',
    title: 'Entrega em Andamento',
    description: 'A Serra Circular Makita está a caminho.',
    timestamp: '',
    extraInfo: 'Tempo estimado de chegada: Hoje às 15:00',
  },
  {
    id: '4',
    type: 'success',
    title: 'Ferramenta Devolvida',
    description: 'A devolução da Parafusadeira Dewalt foi registrada.',
    timestamp: '28/09/2026 às 09h40',
  },
  {
    id: '5',
    type: 'warning',
    title: 'Pagamento Pendente',
    description: 'O pagamento da locação da Betoneira ainda não foi confirmado.',
    timestamp: '27/09/2026 às 14h20',
    showRenovar: true,
  },
];

export const PAGE_SIZE = 3;

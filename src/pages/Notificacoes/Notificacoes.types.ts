export type NotificationType = 'success' | 'warning' | 'delivery';

export type FilterOption = 'Hoje' | 'Ontem' | 'Esta semana' | 'Este mês';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  /** Data/hora já formatada para exibição, ex: "02/10/2025 às 10h15" */
  timestamp: string;
  /** Linha extra usada pelo card de entrega, ex: "Tempo estimado de chegada: Hoje às 15:00" */
  extraInfo?: string;
  /** Exibe o botão amarelo "Renovar" quando true */
  showRenovar?: boolean;
}

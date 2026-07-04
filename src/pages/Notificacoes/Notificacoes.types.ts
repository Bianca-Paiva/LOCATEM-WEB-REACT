export type NotificationType = 'success' | 'warning' | 'delivery';

export type FilterOption = 'Todas' | 'Hoje' | 'Ontem' | 'Esta semana' | 'Este mês';

/** Identifica o "assunto" da notificação, usado para decidir o conteúdo do modal de detalhes */
export type NotificationCategory =
  | 'reserva-confirmada'
  | 'devolucao-pendente'
  | 'entrega-andamento'
  | 'ferramenta-devolvida'
  | 'pagamento-pendente';

/**
 * Dados extras exibidos no modal "Ver detalhes".
 * Todos os campos são opcionais porque cada categoria usa apenas um subconjunto deles.
 * Estrutura pensada para mapear diretamente a resposta futura da API.
 */
export interface NotificationDetails {
  equipamento?: string;
  status?: string;
  dataConfirmacao?: string;
  periodoLocacao?: string;
  valor?: string;
  formaPagamento?: string;
  dataLimite?: string;
  statusEntrega?: string;
  previsaoChegada?: string;
  dataDevolucao?: string;
  statusPagamento?: string;
}

export interface NotificationData {
  id: string;
  type: NotificationType; // controla cor/ícone do card
  category: NotificationCategory; // controla conteúdo do modal
  title: string;
  description: string;
  timestamp: string; /** Data/hora já formatada para exibição, ex: "02/10/2025 às 10h15" */
  date: string; /** Data em ISO, usada apenas para o filtro por período */
  extraInfo?: string; /** Linha extra usada pelo card de entrega, ex: "Tempo estimado de chegada: Hoje às 15:00" */
  showRenovar?: boolean; /** Exibe o botão amarelo "Renovar" quando true */
  details: NotificationDetails; /** Dados exibidos no modal "Ver detalhes" */
}
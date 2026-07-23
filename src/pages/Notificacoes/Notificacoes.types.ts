export type NotificationType =
  | 'success'
  | 'warning'
  | 'delivery'
  | 'error'
  | 'info'
  | 'promotion'
  | 'message'
  | 'reminder';

import type { StatusReserva } from '../Reservas/MinhasReservas/MinhasReservas.types';

export type FilterOption = 'Todas' | 'Hoje' | 'Ontem' | 'Esta semana' | 'Este mês';

/** Identifica o "assunto" da notificação, usado para decidir o conteúdo do modal de detalhes */
export type NotificationCategory =
  | 'reserva-confirmada'
  | 'reserva-cancelada'
  | 'devolucao-pendente'
  | 'devolucao-atrasada'
  | 'entrega-andamento'
  | 'entrega-concluida'
  | 'ferramenta-devolvida'
  | 'pagamento-pendente'
  | 'pagamento-confirmado'
  | 'pagamento-recusado'
  | 'promocao-disponivel'
  | 'avaliacao-pendente'
  | 'nova-mensagem';

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
  // Reserva cancelada
  motivoCancelamento?: string;
  dataCancelamento?: string;
  valorReembolso?: string;
  // Devolução atrasada
  diasAtraso?: string;
  multa?: string;
  // Entrega concluída
  dataEntrega?: string;
  recebidoPor?: string;
  // Pagamento recusado
  motivoRecusa?: string;
  // Promoção disponível
  cupom?: string;
  desconto?: string;
  validade?: string;
  categoriaEquipamento?: string;
  // Avaliação pendente
  notaSugerida?: string;
  // Nova mensagem
  remetente?: string;
  assunto?: string;
  mensagem?: string;
}

export interface NotificationData {
  id: string;
  type: NotificationType; // controla cor/ícone do card (fallback quando não há statusReserva)
  category: NotificationCategory; // controla conteúdo do modal e o botão de ação exibido
  title: string;
  description: string;
  timestamp: string; /** Data/hora já formatada para exibição, ex: "02/10/2025 às 10h15" */
  date: string; /** Data em ISO, usada apenas para o filtro por período */
  extraInfo?: string; /** Linha extra usada pelo card de entrega, ex: "Tempo estimado de chegada: Hoje às 15:00" */
  showRenovar?: boolean; /** Exibe o botão amarelo "Renovar" quando true */
  details: NotificationDetails; /** Dados exibidos no modal "Ver detalhes" */

  /**
   * Status equivalente em 'MinhasReservas'. Quando presente, o card e o modal usam o
   * mesmo ícone/cor de `STATUS_CONFIG` (o mesmo usado em EtiquetaStatus), em vez do
   * ícone genérico de `type`.
   */
  statusReserva?: StatusReserva;

  /** Id da reserva (ReservaData) relacionada, usado para levar o usuário até
   * 'Detalhes da Reserva' ou 'Avaliação' já com a reserva certa selecionada. */
  reservaId?: string;
}
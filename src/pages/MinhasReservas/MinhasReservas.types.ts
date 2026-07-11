/** Status possíveis de uma solicitação de reserva */
export type StatusReserva = 'pendente' | 'aprovada' | 'recusada' | 'cancelada';

/** Aba selecionada no filtro de reservas ('todas' + cada status) */
export type FiltroReserva = 'todas' | StatusReserva;

export interface ReservaData {
  id: string;
  produto: string;
  imagem: string;
  /** Período já formatado para exibição, ex: "15 Jul – 18 Jul 2025" */
  periodo: string;
  locador: string;
  status: StatusReserva;
  /** Texto auxiliar exibido abaixo do locador, ex: "Aguardando aprovação do locador" */
  mensagemStatus: string;
}

/** Configuração visual/textual de cada status (usado no badge e nas abas) */
export interface StatusConfig {
  label: string;
  tabLabel: string;
}

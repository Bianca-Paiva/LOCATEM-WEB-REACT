/** Status possíveis de uma solicitação de reserva */
export type StatusReserva = 'pendente' | 'aprovada' | 'recusada' | 'cancelada';

/** Aba selecionada no filtro de reservas ('todas' + cada status) */
export type FiltroReserva = 'todas' | StatusReserva;

export interface ReservaData {
  id: string;
  produto: string;
  imagem: string;
  periodo: string; /** Período já formatado para exibição, ex: "15 Jul – 18 Jul 2025" */
  locador: string;
  status: StatusReserva;
  mensagemStatus: string; /** Texto auxiliar exibido abaixo do locador, ex: "Aguardando aprovação do locador" */

  // ── Dados usados na tela de Detalhes da Reserva ──────────────────────────
  categoria: string; /** Ex: "Elétrica • Parafusadeira/Furadeira" */
  avaliacaoLocador: number;
  numeroAvaliacoes: number;
  localizacao: string; /** Ex: "São Paulo - SP" */
  dataInicio: string;
  horaInicio: string;
  dataFim: string;
  horaFim: string;
  quantidade: number;
  valorEstimado: string; /** Valor já formatado, ex: "R$ 200,00" */
  motivoRecusa?: string; /** Preenchido apenas quando status === 'recusada' */
  motivoCancelamento?: string; /** Preenchido quando a reserva for cancelada com um motivo específico */
}

/** Configuração visual/textual de cada status (usado no badge e nas abas) */
export interface StatusConfig {
  label: string;
  tabLabel: string;
}

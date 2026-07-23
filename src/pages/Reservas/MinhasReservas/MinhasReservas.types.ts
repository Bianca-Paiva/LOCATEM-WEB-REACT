/** Status possíveis de uma solicitação de reserva */
export type StatusReserva =
  | 'pendente' // Aguardando aprovação do locador
  | 'aguardandoPagamento'
  | 'preparandoEntrega'
  | 'emTransporte'
  | 'emAndamento'
  | 'aguardandoDevolucao'
  | 'devolucaoEmTransporte'
  | 'finalizada'
  | 'recusada'
  | 'cancelada';

/** Aba selecionada no filtro de reservas ('todas' + cada status) */
export type FiltroReserva = 'todas' | StatusReserva;

export interface ReservaData {
  id: string;
  produto: string;
  imagem: string;
  periodo: string; /** Período já formatado para exibição, ex: "15 Jul – 18 Jul 2026" */
  locador: string;
  status: StatusReserva;
  mensagemStatus: string; /** Texto auxiliar exibido abaixo do locador, ex: "Aguardando aprovação do locador" */

  // ── Dados usados na tela de Detalhes da Reserva ──────────────────────────
  categoria: string; /** Ex: "Elétrica • Parafusadeira/Furadeira" */
  avaliacaoLocador: number;
  numeroAvaliacoes: number;
  localizacao: string; /** Ex: "São Paulo - SP" */
  dataInicio: string;
  horaInicio: string; /** Início da janela de 3h de entrega escolhida na solicitação (ex: "09:00" → exibido como "09:00 às 12:00" via formatarIntervaloHorario) */
  dataFim: string;
  horaFim: string; /** Início da janela de 3h de coleta/devolução escolhida na solicitação (ex: "15:00" → exibido como "15:00 às 18:00" via formatarIntervaloHorario) */
  quantidade: number;
  valor: string; /** Valor já formatado, ex: "R$ 200,00" */
  motivoRecusa?: string; /** Preenchido apenas quando status === 'recusada' */
  motivoCancelamento?: string; /** Preenchido quando a reserva for cancelada com um motivo específico */
  prazoPagamento?: string; /** ISO datetime: prazo limite para pagamento (status 'aguardandoPagamento'); expirado sem pagamento, a reserva é cancelada automaticamente */

  // ── Endereço/contato informados na solicitação (Solicitar Reserva) ───────
  frete?: string; /** Valor do frete já formatado, ex: "R$ 15,00" */
  endereco?: {
    cep: string;
    ruaAvenida: string;
    numero: string;
    complemento: string;
  };
  nomeContato?: string;
  telefoneContato?: string;
}
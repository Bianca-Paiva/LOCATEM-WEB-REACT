import type { RegistroAvaliacao } from '../../Avaliacao/Avaliacao.types';

/** Status possíveis de uma solicitação de locacao */
export type StatusLocacao =
  | 'pendente' // Aguardando aprovação do locador
  | 'aguardandoPagamento'
  | 'confirmada' // Pagamento confirmado (aprovação automática ou manual já aprovada)
  | 'preparandoEntrega'
  | 'emTransporte'
  | 'emAndamento'
  | 'aguardandoDevolucao'
  | 'devolucaoEmTransporte'
  | 'finalizada'
  | 'recusada'
  | 'cancelada';

/** Aba selecionada no filtro de locacoes ('todas' + cada status) */
export type FiltroLocacao = 'todas' | StatusLocacao;

/**
 * Motivo granular de um cancelamento (status === 'cancelada'), independente do texto livre já exibido em `motivoCancelamento`. Permite que cada perspectiva (locatário/locador) monte sua própria mensagem a partir do mesmo dado, sem depender de parsing de texto:
 * - 'locatario': o próprio locatário cancelou a locação.
 * - 'faltaPagamento': o locatário não pagou dentro do prazo de 24h.
 * - 'faltaRespostaLocador': o locador não aceitou nem recusou dentro do prazo de 24h.
 */
export type MotivoCancelamento = 'locatario' | 'faltaPagamento' | 'faltaRespostaLocador';

export interface EnderecoLocacao {
  ruaAvenida: string;
  numero: string;
  complemento?: string;
}

export interface LocacaoData {
  id: string;
  produtoId: number; /** Liga a locação à ferramenta de origem (PRODUTOS_MOCK) — usado no desempenho da ferramenta e em telas do locador. */
  produto: string;
  imagem: string;
  periodo: string; /** Período já formatado para exibição, ex: "15 Jul – 18 Jul 2026" */
  locador: string;
  locadorId: string; /** Identificador do locador dono da ferramenta — usado para filtrar "Gerenciar Locações"/"Histórico" pelo locador autenticado. */
  locatario: string; /** Nome do locatário que fez a solicitação — exibido nas telas do locador (Gerenciar Locações, Histórico). */
  status: StatusLocacao;
  mensagemStatus: string; /** Texto auxiliar exibido abaixo do locador, ex: "Aguardando aprovação do locador" */

  // ── Dados usados na tela de Detalhes da Locacao ──────────────────────────
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
  motivoCancelamento?: string; /** Preenchido quando a locacao for cancelada com um motivo específico */
  prazoPagamento?: string; /** ISO datetime: prazo limite para pagamento (status 'aguardandoPagamento'); expirado sem pagamento, a locacao é cancelada automaticamente */

  // ── Endereço/contato informados na solicitação (Solicitar Locacao) ───────
  frete?: string; /** Valor do frete já formatado, ex: "R$ 15,00" */
  endereco?: {
    cep: string;
    ruaAvenida: string;
    numero: string;
    complemento: string;
  };
  nomeContato?: string;
  telefoneContato?: string;

  // ── Fluxo de avaliação (liberado quando status === 'finalizada') ─────────
  /** Preenchido quando o locatário avalia esta locação — também evita reavaliação duplicada. */
  avaliacaoDoLocatario?: RegistroAvaliacao;
  /** Preenchido quando o locador avalia esta locação — também evita reavaliação duplicada. */
  avaliacaoDoLocador?: RegistroAvaliacao;
}
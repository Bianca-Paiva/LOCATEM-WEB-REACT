import type { LocacaoData } from '../../Locacoes/MinhasLocacoes/MinhasLocacoes.types';

/**
 * Movimento logístico exibido na "Agenda da Semana" da Home do Locador.
 *
 * A entrega é feita por um serviço terceirizado, então nunca usamos os termos
 * "Retirada"/"Devolução" (ambíguos quanto a quem está com a ferramenta):
 * - 'coletaParaEntrega': a transportadora está indo buscar a ferramenta COM O
 *   LOCADOR para entregá-la ao locatário (LOCADOR -> transportadora -> LOCATÁRIO).
 * - 'retornoAoLocador': a transportadora já buscou a ferramenta com o locatário
 *   e está trazendo de volta ao locador (LOCATÁRIO -> transportadora -> LOCADOR).
 */
export type TipoMovimentoLogisticoLocador = 'coletaParaEntrega' | 'retornoAoLocador';

/** Um evento da seção "Agenda da Semana", derivado de uma locação real do locador. */
export interface AgendaSemanaLocadorItem {
  /** Único por evento (uma mesma locação pode gerar até 2 eventos: coleta e retorno). */
  id: string;
  locacaoId: string;
  /** Data do evento, formato "dd/mm/aaaa" (mesmo formato de LocacaoData). */
  data: string;
  /** Horário do evento, ex: "09:00". */
  hora: string;
  ferramenta: string;
  imagem: string;
  locatario: string;
  tipoMovimento: TipoMovimentoLogisticoLocador;
}

/** Números exibidos nos cards de resumo do topo da Home do Locador. */
export interface ResumoHomeLocador {
  ferramentasAtivas: number;
  /** Ferramentas cadastradas no mês atual (data real do dispositivo) — alimenta o texto "+N este mês". */
  ferramentasCadastradasEsteMes: number;
  locacoesEmAndamento: number;
  solicitacoesPendentes: number;
  /** Soma das locações finalizadas com início no mês atual (mesma regra de "receita" já usada em FerramentaDetalhe, aplicada ao mês corrente). */
  faturamentoMesAtual: number;
  faturamentoMesAnterior: number;
}

/** Item da seção "Solicitações Recentes" — é a própria LocacaoData, sem nenhum recorte (a Home mostra os mesmos dados de Gerenciar Locações). */
export type SolicitacaoRecenteLocador = LocacaoData;

import type { LocacaoData, StatusLocacao } from './MinhasLocacoes.types';
import { PRODUTOS_MOCK } from '../../../mocks/produtos.mock';
import { toLocacaoProdutoBase } from '../../../mocks/produtos.adapters';

const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/** Converte "dd/mm/aaaa" em Date, sem depender de fuso/timezone. */
function paraData(data: string): Date {
  const [dia, mes, ano] = data.split('/').map(Number);
  return new Date(ano, mes - 1, dia);
}

/** Quantidade de diárias entre o início e o fim da locação (mínimo de 1). */
function calcularDiarias(dataInicio: string, dataFim: string): number {
  const diffMs = paraData(dataFim).getTime() - paraData(dataInicio).getTime();
  const dias = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(dias, 1);
}

/** Monta o texto de período exibido no card, ex: "15 Jul – 18 Jul 2025". */
function formatarPeriodo(dataInicio: string, dataFim: string): string {
  const inicio = paraData(dataInicio);
  const fim = paraData(dataFim);
  const diaMes = (d: Date) => `${String(d.getDate()).padStart(2, '0')} ${MESES_ABREV[d.getMonth()]}`;
  return `${diaMes(inicio)} – ${diaMes(fim)} ${fim.getFullYear()}`;
}

/** Converte "15,00" -> 15 (number). */
function paraNumero(precoStr: string): number {
  return Number(precoStr.replace(',', '.'));
}

/** Formata um número para o padrão monetário brasileiro, ex: 45 -> "R$ 45,00". */
function formatarValor(valor: number): string {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

interface DadosSolicitacao {
  produtoId: number;
  status: StatusLocacao;
  mensagemStatus: string;
  dataInicio: string; // dd/mm/aaaa
  horaInicio: string;
  dataFim: string; // dd/mm/aaaa
  horaFim: string;
  quantidade: number;
  motivoRecusa?: string;
  motivoCancelamento?: string;
  /** Prazo (em horas, a partir de agora) para pagamento antes do cancelamento automático. Padrão: 24h. */
  prazoPagamentoHoras?: number;
}

const PRAZO_PADRAO_PAGAMENTO_HORAS = 24;

/**
 * Monta uma locacao completa combinando os dados fixos do produto (vindos de
 * `PRODUTOS_MOCK`, via `toLocacaoProdutoBase`) com os dados específicos da
 * solicitação (período, status, datas, quantidade). O valor final é sempre
 * calculado como preço da diária × quantidade de ferramentas × nº de diárias.
 */
function criarLocacao(id: string, dados: DadosSolicitacao): LocacaoData {
  const produto = PRODUTOS_MOCK.find((p) => p.id === dados.produtoId);

  if (!produto) {
    throw new Error(`[MinhasLocacoes.mock] Produto id=${dados.produtoId} não encontrado em PRODUTOS_MOCK`);
  }

  const diarias = calcularDiarias(dados.dataInicio, dados.dataFim);
  const valorTotal = paraNumero(produto.price) * dados.quantidade * diarias;

  // Só locacoes aguardando pagamento têm prazo — usado para o cancelamento automático
  const prazoPagamento =
    dados.status === 'aguardandoPagamento'
      ? new Date(
          Date.now() + (dados.prazoPagamentoHoras ?? PRAZO_PADRAO_PAGAMENTO_HORAS) * 60 * 60 * 1000
        ).toISOString()
      : undefined;

  return {
    id,
    ...toLocacaoProdutoBase(produto),
    periodo: formatarPeriodo(dados.dataInicio, dados.dataFim),
    status: dados.status,
    mensagemStatus: dados.mensagemStatus,
    dataInicio: dados.dataInicio,
    horaInicio: dados.horaInicio,
    dataFim: dados.dataFim,
    horaFim: dados.horaFim,
    quantidade: dados.quantidade,
    valor: formatarValor(valorTotal),
    motivoRecusa: dados.motivoRecusa,
    motivoCancelamento: dados.motivoCancelamento,
    prazoPagamento,
  };
}

// Mock de locacoes: cada uma referencia um produto real de PRODUTOS_MOCK
// (ferramenta, imagem, categoria, avaliações, localização e locador vêm de lá)
// e acrescenta os dados da própria solicitação de locacao.
export const mockLocacoes: LocacaoData[] = [
  criarLocacao('1', {
    produtoId: 1, // Furadeira Parafusadeira Sem Fio... The Black Tools (MS Ferramentas)
    status: 'pendente',
    mensagemStatus: 'A solicitação foi enviada e o locador ainda não respondeu',
    dataInicio: '15/07/2026',
    horaInicio: '09:00',
    dataFim: '18/07/2026',
    horaFim: '18:00',
    quantidade: 1,
  }),
  criarLocacao('2', {
    produtoId: 2, // Pistola de Pintura The Black Tools (WZ Ferramentas)
    status: 'aguardandoPagamento',
    mensagemStatus: 'Locação aceita, efetue o pagamento em 24hs para continuar',
    dataInicio: '10/07/2026',
    horaInicio: '08:00',
    dataFim: '12/07/2026',
    horaFim: '17:00',
    quantidade: 1,
  }),
  criarLocacao('3', {
    produtoId: 3, // Parafusadeira Furadeira de Impacto Hanabi (João Ferramentas)
    status: 'preparandoEntrega',
    mensagemStatus: 'O pagamento foi confirmado e a entrega está sendo preparada',
    dataInicio: '05/07/2026',
    horaInicio: '09:00',
    dataFim: '07/07/2026',
    horaFim: '18:00',
    quantidade: 1,
  }),
  criarLocacao('4', {
    produtoId: 4, // Aparador De Grama Bipartido Tramontina (JB Ferramentas)
    status: 'emTransporte',
    mensagemStatus: 'Ferramenta a caminho do seu endereço',
    dataInicio: '01/07/2026',
    horaInicio: '09:00',
    dataFim: '03/07/2026',
    horaFim: '18:00',
    quantidade: 1,
  }),
  criarLocacao('5', {
    produtoId: 5, // Parafusadeira e Furadeira WAP 12V (JB Ferramentas)
    status: 'emAndamento',
    mensagemStatus: 'Você recebeu a ferramenta e o período de locação começou',
    dataInicio: '20/07/2026',
    horaInicio: '09:00',
    dataFim: '25/07/2026',
    horaFim: '18:00',
    quantidade: 2,
  }),
  criarLocacao('6', {
    produtoId: 6, // Serra Circular Profissional DESOON 24 Dentes (JB Ferramentas)
    status: 'aguardandoDevolucao',
    mensagemStatus: 'O período de locação está acabando e deve retornar para o locador',
    dataInicio: '22/07/2026',
    horaInicio: '09:00',
    dataFim: '24/07/2026',
    horaFim: '18:00',
    quantidade: 1,
  }),
  criarLocacao('7', {
    produtoId: 7, // Parafusadeira e Furadeira WAP 12V Cinza (JB Ferramentas)
    status: 'devolucaoEmTransporte',
    mensagemStatus: 'A ferramenta foi coletada e está voltando para o locador',
    dataInicio: '22/07/2026',
    horaInicio: '09:00',
    dataFim: '24/07/2026',
    horaFim: '18:00',
    quantidade: 1,
  }),
  criarLocacao('8', {
    produtoId: 6, // Serra Circular Profissional DESOON 24 Dentes (JB Ferramentas)
    status: 'recusada',
    mensagemStatus: 'Recusada pelo Locador',
    dataInicio: '22/07/2026',
    horaInicio: '09:00',
    dataFim: '24/07/2026',
    horaFim: '18:00',
    quantidade: 1,
    motivoRecusa: 'Infelizmente a ferramenta estará em manutenção na data solicitada.',
  }),
  criarLocacao('9', {
    produtoId: 6, // Serra Circular Profissional DESOON 24 Dentes (JB Ferramentas)
    status: 'cancelada',
    mensagemStatus: 'Esta locação foi cancelada por você.',
    dataInicio: '22/07/2026',
    horaInicio: '09:00',
    dataFim: '24/07/2026',
    horaFim: '18:00',
    quantidade: 1,
    motivoCancelamento: 'Esta locação foi cancelada por você.',
  }),
  criarLocacao('10', {
    produtoId: 6, // Serra Circular Profissional DESOON 24 Dentes (JB Ferramentas)
    status: 'finalizada',
    mensagemStatus: 'Locação Finalizada',
    dataInicio: '22/07/2026',
    horaInicio: '09:00',
    dataFim: '24/07/2026',
    horaFim: '18:00',
    quantidade: 1,
  }),
  criarLocacao('11', {
    produtoId: 6, // Serra Circular Profissional DESOON 24 Dentes (JB Ferramentas)
    status: 'cancelada',
    mensagemStatus: 'Locação cancelada automaticamente por falta de pagamento dentro do prazo.',
    dataInicio: '22/07/2026',
    horaInicio: '09:00',
    dataFim: '24/07/2026',
    horaFim: '18:00',
    quantidade: 1,
    motivoCancelamento: 'Locação cancelada automaticamente por falta de pagamento dentro do prazo.',
  }),
];
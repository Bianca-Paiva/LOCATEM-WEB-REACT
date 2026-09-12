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
  /** Nome do locatário que solicitou a locação — exibido nas telas do locador (Gerenciar Locações, Histórico). */
  locatario: string;
  /** Endereço de entrega informado na solicitação — exibido no modal de aprovação (visão do locador). */
  endereco?: LocacaoData['endereco'];
  motivoRecusa?: string;
  motivoCancelamento?: string;
  /** Prazo (em horas, a partir de agora) para pagamento antes do cancelamento automático. Padrão: 24h. */
  prazoPagamentoHoras?: number;
}

const PRAZO_PADRAO_PAGAMENTO_HORAS = 24;

/**
 * Monta uma locacao completa combinando os dados fixos do produto (vindos de `PRODUTOS_MOCK`, via `toLocacaoProdutoBase`) com os dados específicos da solicitação (período, status, datas, quantidade). O valor final é sempre calculado como preço da diária × quantidade de ferramentas × nº de diárias.
 */
function criarLocacao(id: string, dados: DadosSolicitacao): LocacaoData {
  const produto = PRODUTOS_MOCK.find((p) => p.id === dados.produtoId);

  if (!produto) {
    throw new Error(`[MinhasLocacoes.mock] Produto id=${dados.produtoId} não encontrado em PRODUTOS_MOCK`);
  }

  const diarias = calcularDiarias(dados.dataInicio, dados.dataFim);
  const valorTotal = paraNumero(produto.price) * dados.quantidade * diarias;

  // Só locações aguardando pagamento têm prazo — usado para o cancelamento automático
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
    locatario: dados.locatario,
    status: dados.status,
    mensagemStatus: dados.mensagemStatus,
    dataInicio: dados.dataInicio,
    horaInicio: dados.horaInicio,
    dataFim: dados.dataFim,
    horaFim: dados.horaFim,
    quantidade: dados.quantidade,
    valor: formatarValor(valorTotal),
    endereco: dados.endereco,
    motivoRecusa: dados.motivoRecusa,
    motivoCancelamento: dados.motivoCancelamento,
    prazoPagamento,
  };
}

// Mock de locacções: cada uma referencia um produto real de PRODUTOS_MOCK (ferramenta, imagem, categoria, avaliações, localização e locador vêm de lá) e acrescenta os dados da própria solicitação de locacao.
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
    locatario: 'Carlos Andrade',
    endereco: {
      cep: '03988-000',
      ruaAvenida: 'Av. Sapopemba',
      numero: '1200',
      complemento: '',
    },
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
    locatario: 'Juliana Prado',
    endereco: {
      cep: '03972-000',
      ruaAvenida: 'Rua Barão de Duprat',
      numero: '450',
      complemento: 'Casa 2',
    },
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
    locatario: 'Rafael Lima',
    endereco: {
      cep: '03931-000',
      ruaAvenida: 'Rua São Mateus',
      numero: '87',
      complemento: '',
    },
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
    locatario: 'Ana Souza',
    endereco: {
      cep: '03960-000',
      ruaAvenida: 'Rua Sapopemba',
      numero: '2310',
      complemento: 'Apto 12',
    },
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
    locatario: 'Pedro Melo',
    endereco: {
      cep: '03910-000',
      ruaAvenida: 'Rua Águia de Haia',
      numero: '640',
      complemento: '',
    },
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
    locatario: 'Bianca Reis',
    endereco: {
      cep: '03920-000',
      ruaAvenida: 'Rua Barão de Duprat',
      numero: '120',
      complemento: '',
    },
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
    locatario: 'Marcos Vidal',
    endereco: {
      cep: '03945-000',
      ruaAvenida: 'Av. Sapopemba',
      numero: '5400',
      complemento: '',
    },
  }),
  criarLocacao('8', {
    produtoId: 6, // Serra Circular Profissional DESOON 24 Dentes (JB Ferramentas)
    status: 'recusada',
    mensagemStatus: 'Solicitação Recusada pelo Locador',
    dataInicio: '22/07/2026',
    horaInicio: '09:00',
    dataFim: '24/07/2026',
    horaFim: '18:00',
    quantidade: 1,
    locatario: 'Diego Farias',
    endereco: {
      cep: '03920-000',
      ruaAvenida: 'Rua São Mateus',
      numero: '210',
      complemento: '',
    },
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
    locatario: 'Sônia Alves',
    endereco: {
      cep: '03960-000',
      ruaAvenida: 'Rua Águia de Haia',
      numero: '55',
      complemento: 'Fundos',
    },
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
    locatario: 'Fernando Lopes',
    endereco: {
      cep: '03931-000',
      ruaAvenida: 'Rua Barão de Duprat',
      numero: '980',
      complemento: '',
    },
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
    locatario: 'Camila Torres',
    endereco: {
      cep: '03972-000',
      ruaAvenida: 'Av. Sapopemba',
      numero: '3120',
      complemento: 'Apto 45',
    },
    motivoCancelamento: 'Locação cancelada automaticamente por falta de pagamento dentro do prazo.',
  }),

  // ── Locações adicionais: garantem que os três locadores (MS, WZ e JB —
  // ver mocks/locadores.mock.ts) tenham solicitações "Aguardando aprovação" e
  // um histórico mínimo, para exercitar Gerenciar Locações/Histórico de cada um.
  criarLocacao('12', {
    produtoId: 3, // Parafusadeira Furadeira de Impacto Hanabi (JB Ferramentas)
    status: 'pendente',
    mensagemStatus: 'A solicitação foi enviada e o locador ainda não respondeu',
    dataInicio: '04/09/2026',
    horaInicio: '09:00',
    dataFim: '07/09/2026',
    horaFim: '18:00',
    quantidade: 1,
    locatario: 'Carlos Andrade',
    endereco: {
      cep: '03988-000',
      ruaAvenida: 'Av. Sapopemba',
      numero: '1200',
      complemento: '',
    },
  }),
  criarLocacao('13', {
    produtoId: 1, // Furadeira Parafusadeira Sem Fio The Black Tools (MS Ferramentas)
    status: 'aguardandoPagamento',
    mensagemStatus: 'Locação aceita, efetue o pagamento em 24hs para continuar',
    dataInicio: '06/09/2026',
    horaInicio: '09:00',
    dataFim: '08/09/2026',
    horaFim: '18:00',
    quantidade: 1,
    locatario: 'Renata Alves',
    endereco: {
      cep: '03910-000',
      ruaAvenida: 'Rua Águia de Haia',
      numero: '310',
      complemento: '',
    },
  }),
  criarLocacao('14', {
    produtoId: 9, // Serra Mármore Profissional Makita (MS Ferramentas)
    status: 'finalizada',
    mensagemStatus: 'Locação Finalizada',
    dataInicio: '28/08/2026',
    horaInicio: '09:00',
    dataFim: '31/08/2026',
    horaFim: '18:00',
    quantidade: 1,
    locatario: 'Diego Martins',
    endereco: {
      cep: '03960-000',
      ruaAvenida: 'Rua Sapopemba',
      numero: '740',
      complemento: '',
    },
  }),
  criarLocacao('15', {
    produtoId: 2, // Pistola de Pintura The Black Tools (WZ Ferramentas)
    status: 'pendente',
    mensagemStatus: 'A solicitação foi enviada e o locador ainda não respondeu',
    dataInicio: '05/09/2026',
    horaInicio: '08:00',
    dataFim: '06/09/2026',
    horaFim: '17:00',
    quantidade: 1,
    locatario: 'Patrícia Nogueira',
    endereco: {
      cep: '03945-000',
      ruaAvenida: 'Av. Sapopemba',
      numero: '5400',
      complemento: '',
    },
  }),
  criarLocacao('16', {
    produtoId: 10, // Lixadeira Orbital 320w (WZ Ferramentas)
    status: 'finalizada',
    mensagemStatus: 'Locação Finalizada',
    dataInicio: '20/08/2026',
    horaInicio: '09:00',
    dataFim: '22/08/2026',
    horaFim: '18:00',
    quantidade: 1,
    locatario: 'Fábio Ramos',
    endereco: {
      cep: '03920-000',
      ruaAvenida: 'Rua Barão de Duprat',
      numero: '120',
      complemento: '',
    },
  }),
];
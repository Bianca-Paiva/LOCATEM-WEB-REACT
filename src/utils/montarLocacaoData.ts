import type { ProdutoSelecionado } from '../context/ProdutoContext';
import type { DadosLocacaoModal } from '../components/SolicitarLocacao/SolicitarLocacaoModal/SolicitarLocacaoModal.types';
import type { LocacaoData } from '../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import type { NotificationData } from '../pages/Notificacoes/Notificacoes.types';

const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

// Converte "dd/mm/aaaa" em Date, sem depender de fuso horário
function paraData(dataBr: string): Date | null {
  if (!dataBr) return null;
  const [dia, mes, ano] = dataBr.split('/').map(Number);
  if (!dia || !mes || !ano) return null;
  return new Date(ano, mes - 1, dia);
}

function formatarPeriodo(dataInicioBr: string, dataFimBr: string): string {
  const inicio = paraData(dataInicioBr);
  const fim = paraData(dataFimBr);
  if (!inicio || !fim) return '';
  const diaMes = (d: Date) => `${String(d.getDate()).padStart(2, '0')} ${MESES_ABREV[d.getMonth()]}`;
  return `${diaMes(inicio)} – ${diaMes(fim)} ${fim.getFullYear()}`;
}

/**
 * Monta os dados de uma nova solicitação de locação (sem `id`, atribuído por
 * `useLocacaoStore.adicionarLocacao`) a partir do produto e do que foi
 * escolhido no modal — usado apenas no fluxo de aprovação manual, onde a
 * solicitação entra como "Aguardando aprovação" (`status: 'pendente'`).
 */
export function montarLocacaoPendente(
  produto: ProdutoSelecionado,
  dados: DadosLocacaoModal,
): Omit<LocacaoData, 'id'> {
  return {
    produto: produto.title,
    imagem: produto.images?.[0] ?? '',
    periodo: formatarPeriodo(dados.resumo.dataEntregaFormatada, dados.resumo.dataDevolucaoFormatada),
    locador: produto.locador,
    status: 'pendente',
    mensagemStatus: 'A solicitação foi enviada e o locador ainda não respondeu',
    categoria: produto.categoria,
    avaliacaoLocador: produto.rating,
    numeroAvaliacoes: produto.reviewCount,
    localizacao: produto.localizacao,
    dataInicio: dados.resumo.dataEntregaFormatada,
    horaInicio: dados.horarioEntrega,
    dataFim: dados.resumo.dataDevolucaoFormatada,
    horaFim: dados.horarioDevolucao,
    quantidade: dados.quantidade,
    valor: dados.resumo.valorFormatado,
    frete: dados.resumo.freteFormatado,
    // O prazo de pagamento (24h) só começa a contar quando o locador aprovar
    // a solicitação (status muda para 'aguardandoPagamento'); por isso não é
    // definido aqui ainda.
  };
}

/**
 * Monta a notificação enviada ao locatário assim que a solicitação de
 * locação (aprovação manual) é enviada, informando o prazo de 24h que o
 * locador tem para responder.
 */
export function montarNotificacaoSolicitacaoEnviada(
  produto: ProdutoSelecionado,
  locacaoId: string,
  periodoLocacao: string,
): Omit<NotificationData, 'id'> {
  const agora = new Date();
  const timestamp = `${String(agora.getDate()).padStart(2, '0')}/${String(agora.getMonth() + 1).padStart(2, '0')}/${agora.getFullYear()} às ${String(agora.getHours()).padStart(2, '0')}h${String(agora.getMinutes()).padStart(2, '0')}`;

  return {
    type: 'info',
    category: 'locacao-confirmada',
    title: 'Solicitação enviada',
    description: `Sua solicitação de locação de ${produto.title} foi enviada ao locador. Ele tem até 24h para responder.`,
    timestamp,
    date: agora.toISOString(),
    statusLocacao: 'pendente',
    locacaoId,
    details: {
      equipamento: produto.title,
      status: 'Aguardando aprovação',
      periodoLocacao,
    },
  };
}

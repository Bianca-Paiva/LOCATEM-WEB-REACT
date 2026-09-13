import type { ProdutoSelecionado } from '../../context/Produto/ProdutoContext';
import type { DadosLocacaoModal } from '../../components/SolicitarLocacao/SolicitarLocacaoModal/SolicitarLocacaoModal.types';
import type { LocacaoData } from '../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import type { NotificationData } from '../../pages/Notificacoes/Notificacoes.types';
import { formatarPeriodoBr } from './formatoDataBr';

/**
 * Monta os dados de uma nova solicitação de locação (sem `id`, atribuído por
 * `useLocacaoStore.adicionarLocacao`) a partir do produto e do que foi
 * escolhido no modal — usado apenas no fluxo de aprovação manual, onde a
 * solicitação entra como "Aguardando aprovação" (`status: 'pendente'`).
 */
export function montarLocacaoPendente(
  produto: ProdutoSelecionado,
  dados: DadosLocacaoModal,
  nomeLocatario: string,
): Omit<LocacaoData, 'id'> {
  return {
    produtoId: produto.id ?? 0,
    produto: produto.title,
    imagem: produto.images?.[0] ?? '',
    periodo: formatarPeriodoBr(dados.resumo.dataEntregaFormatada, dados.resumo.dataDevolucaoFormatada),
    locador: produto.locador,
    locadorId: produto.locadorId ?? '',
    locatario: nomeLocatario,
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
 * Monta os dados de uma locação já paga (sem `id`, atribuído por
 * `useLocacaoStore.adicionarLocacao`) a partir do produto e do que foi
 * escolhido no modal/carrinho — usado no fluxo de pagamento direto (Carrinho
 * -> Método de Pagamento -> ... -> Pagamento Aprovado), onde não há
 * aprovação manual do locador: a locação já entra confirmada
 * (`status: 'confirmada'`), sem prazo de pagamento (já foi pago).
 */
export function montarLocacaoConfirmada(
  produto: ProdutoSelecionado,
  dados: DadosLocacaoModal,
  nomeLocatario: string,
): Omit<LocacaoData, 'id'> {
  return {
    produtoId: produto.id ?? 0,
    produto: produto.title,
    imagem: produto.images?.[0] ?? '',
    periodo: formatarPeriodoBr(dados.resumo.dataEntregaFormatada, dados.resumo.dataDevolucaoFormatada),
    locador: produto.locador,
    locadorId: produto.locadorId ?? '',
    locatario: nomeLocatario,
    status: 'confirmada',
    mensagemStatus: 'Pagamento confirmado. Aguarde a preparação da entrega.',
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
// Ponto único de leitura/escrita do localStorage para o fluxo de pagamento (Carrinho -> Método de Pagamento -> Selecionar Cartão / Pix).
//
// Únicas chaves utilizadas por todo o fluxo — nenhum outro módulo deve acessar 'locatem_pagamento_*' diretamente via localStorage, para evitar chaves soltas/duplicadas e manter o valor consistente entre as telas.
import type { FormaPagamento } from '../../types/Pagamento/cartao.types';
import type { CartaoPagamentoArmazenado } from '../../types/Pagamento/cartao.types';
import type { ProdutoSelecionado } from '../../context/Produto/ProdutoContext';
import type { DadosLocacaoModal } from '../../components/SolicitarLocacao/SolicitarLocacaoModal/SolicitarLocacaoModal.types';

export const CHAVE_VALOR = 'locatem_pagamento_valor';
export const CHAVE_METODO = 'locatem_pagamento_metodo';
export const CHAVE_CARTAO = 'locatem_pagamento_cartao';
// Marca que a etapa "Processando Pagamento" já concluiu a simulação atual.
// Único propósito: impedir que a tela "Pagamento Aprovado" seja acessada diretamente (ex.: hash digitado à mão) sem passar pelo processamento.
export const CHAVE_PROCESSADO = 'locatem_pagamento_processado';
// Item da locação iniciada direto por "Locar Agora" (fora do carrinho) — único propósito é permitir que "Pagamento Aprovado" exiba o item alugado nesse fluxo, já que ele nunca passa pelo CarrinhoContext.
export const CHAVE_ITEM_AVULSO = 'locatem_pagamento_item_avulso';
// Produto completo + dados da locação escolhidos no modal, para a locação iniciada direto por "Locar Agora" (fora do carrinho) — ao contrário de CHAVE_ITEM_AVULSO (que guarda só o recorte usado para exibição em "Pagamento Aprovado"), esta chave guarda tudo que `montarLocacaoConfirmada` precisa para registrar a locação em "Minhas Locações", já que este fluxo nunca passa pelo CarrinhoContext.
export const CHAVE_LOCACAO_AVULSA = 'locatem_pagamento_locacao_avulsa';

const METODOS_VALIDOS: FormaPagamento[] = ['credito', 'debito', 'pix'];

/**
 * Persiste o valor total da compra (calculado no Carrinho) como string numérica com duas casas decimais e ponto como separador decimal (ex.: "150.90"), conforme especificação do fluxo. Nunca inclui o prefixo "R$" — a formatação em BRL é responsabilidade de quem exibe.
 */
export function salvarValorPagamento(valor: number): void {
  const valorSeguro = Number.isFinite(valor) ? valor : 0;
  localStorage.setItem(CHAVE_VALOR, valorSeguro.toFixed(2));
}

/**
 * Lê o valor total persistido. Retorna 0 caso a chave esteja ausente ou contenha um valor inválido (nunca deve ser recalculado a partir de outras chaves — apenas o que foi salvo pelo Carrinho).
 */
export function lerValorPagamento(): number {
  const bruto = localStorage.getItem(CHAVE_VALOR);
  if (!bruto) return 0;

  const numero = Number(bruto);
  return Number.isFinite(numero) ? numero : 0;
}

/** Persiste a forma de pagamento escolhida na tela "Método de Pagamento". */
export function salvarMetodoPagamento(metodo: FormaPagamento): void {
  localStorage.setItem(CHAVE_METODO, metodo);
}

/** Lê a forma de pagamento persistida, ou null se ausente/inválida. */
export function lerMetodoPagamento(): FormaPagamento | null {
  const bruto = localStorage.getItem(CHAVE_METODO);
  return METODOS_VALIDOS.includes(bruto as FormaPagamento) ? (bruto as FormaPagamento) : null;
}

/**
 * Persiste apenas dados não sensíveis do cartão usado no pagamento (id, bandeira, últimos dígitos). Nunca deve receber número completo,
 * CVV, senha ou qualquer outro dado sensível.
 */
export function salvarCartaoPagamento(cartao: CartaoPagamentoArmazenado): void {
  localStorage.setItem(CHAVE_CARTAO, JSON.stringify(cartao));
}

/** Lê o cartão persistido para o pagamento atual, ou null se ausente/corrompido. */
export function lerCartaoPagamento(): CartaoPagamentoArmazenado | null {
  const bruto = localStorage.getItem(CHAVE_CARTAO);
  if (!bruto) return null;

  try {
    return JSON.parse(bruto) as CartaoPagamentoArmazenado;
  } catch {
    return null;
  }
}

/**
 * Marca que a simulação de processamento do pagamento atual foi concluída.
 * Chamado apenas pela tela "Processando Pagamento" logo antes de navegar para "Pagamento Aprovado".
 */
export function marcarPagamentoProcessado(): void {
  localStorage.setItem(CHAVE_PROCESSADO, 'true');
}

/** Indica se o pagamento atual já passou pela etapa de processamento. */
export function lerPagamentoProcessado(): boolean {
  return localStorage.getItem(CHAVE_PROCESSADO) === 'true';
}

/** Item exibido em "Itens alugados" quando a locação não passa pelo carrinho (fluxo "Locar Agora"). */
export interface ItemPagamentoAvulso {
  id: string;
  nome: string;
  imagem: string;
  dias: number;
  unidades: number;
  /** Dia e horário de entrega escolhidos no modal "Detalhes da Locação" (ex.: "10/08/2026" e "09:00 às 12:00") — exibidos no Resumo de "Pagamento Aprovado". */
  dataEntregaFormatada: string;
  horarioEntregaFormatado: string;
}

/**
 * Persiste o item da locação iniciada direto por "Locar Agora", para que "Pagamento Aprovado" tenha o que exibir em "Itens alugados" — o mesmo papel que o CarrinhoContext cumpre quando a locação vem do Carrinho.
 */
export function salvarItemPagamentoAvulso(item: ItemPagamentoAvulso): void {
  localStorage.setItem(CHAVE_ITEM_AVULSO, JSON.stringify(item));
}

/** Lê o item avulso persistido, ou null se ausente/corrompido. */
export function lerItemPagamentoAvulso(): ItemPagamentoAvulso | null {
  const bruto = localStorage.getItem(CHAVE_ITEM_AVULSO);
  if (!bruto) return null;

  try {
    return JSON.parse(bruto) as ItemPagamentoAvulso;
  } catch {
    return null;
  }
}

/** Produto completo + dados da locação (modal "Detalhes da Locação") da locação iniciada direto por "Locar Agora", necessários para `montarLocacaoConfirmada` registrar a locação em "Minhas Locações" após o pagamento. */
export interface LocacaoAvulsaPendente {
  produto: ProdutoSelecionado;
  dados: DadosLocacaoModal;
}

/**
 * Persiste o produto completo e os dados da locação escolhidos no modal, para a locação iniciada direto por "Locar Agora" — permite que "Pagamento Aprovado" registre a locação em "Minhas Locações" assim como já é feito para o fluxo do carrinho.
 */
export function salvarLocacaoAvulsaPendente(dados: LocacaoAvulsaPendente): void {
  localStorage.setItem(CHAVE_LOCACAO_AVULSA, JSON.stringify(dados));
}

/** Lê o produto/dados da locação avulsa pendente, ou null se ausente/corrompido. */
export function lerLocacaoAvulsaPendente(): LocacaoAvulsaPendente | null {
  const bruto = localStorage.getItem(CHAVE_LOCACAO_AVULSA);
  if (!bruto) return null;

  try {
    return JSON.parse(bruto) as LocacaoAvulsaPendente;
  } catch {
    return null;
  }
}

/**
 * Limpa as chaves do funil de pagamento (valor, método, cartão, item avulso e o carimbo de processado) após a confirmação em "Pagamento Aprovado" — evita que dados de uma compra concluída reapareçam numa compra futura.
 */
export function limparDadosPagamento(): void {
  [
    CHAVE_VALOR,
    CHAVE_METODO,
    CHAVE_CARTAO,
    CHAVE_PROCESSADO,
    CHAVE_ITEM_AVULSO,
    CHAVE_LOCACAO_AVULSA,
  ].forEach((chave) => localStorage.removeItem(chave));
}
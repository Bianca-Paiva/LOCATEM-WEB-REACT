// Ponto único de leitura/escrita do localStorage para o fluxo de pagamento (Carrinho -> Método de Pagamento -> Selecionar Cartão / Pix).
//
// Únicas chaves utilizadas por todo o fluxo — nenhum outro módulo deve acessar 'locatem_pagamento_*' diretamente via localStorage, para evitar chaves soltas/duplicadas e manter o valor consistente entre as telas.
import type { FormaPagamento } from '../types/cartao.types';
import type { CartaoPagamentoArmazenado } from '../types/cartao.types';

export const CHAVE_VALOR = 'locatem_pagamento_valor';
export const CHAVE_METODO = 'locatem_pagamento_metodo';
export const CHAVE_CARTAO = 'locatem_pagamento_cartao';
// Marca que a etapa "Processando Pagamento" já concluiu a simulação atual.
// Único propósito: impedir que a tela "Pagamento Aprovado" seja acessada diretamente (ex.: hash digitado à mão) sem passar pelo processamento.
export const CHAVE_PROCESSADO = 'locatem_pagamento_processado';

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

/**
 * Limpa as chaves do funil de pagamento (valor, método, cartão e o carimbo de processado) após a confirmação em "Pagamento Aprovado" — evita que dados de uma compra concluída reapareçam numa compra futura.
 */
export function limparDadosPagamento(): void {
  [CHAVE_VALOR, CHAVE_METODO, CHAVE_CARTAO, CHAVE_PROCESSADO].forEach((chave) =>
    localStorage.removeItem(chave),
  );
}

// Tipos compartilhados do fluxo de seleção/cadastro de cartão (Pagamento)

export type MetodoPagamento = 'credito' | 'debito';

// Forma de pagamento escolhida na tela "Método de Pagamento" (Carrinho -> Forma
// de Pagamento -> Selecionar Cartão/Pix). Superconjunto de MetodoPagamento, que
// cobre apenas as formas compatíveis com cartões salvos.
export type FormaPagamento = MetodoPagamento | 'pix';

export interface Cartao {
  id: number;
  metodoPagamento: MetodoPagamento;
  bandeira: string;
  final: string;
  titular: string;
}

// Dados não sensíveis do cartão usado no pagamento atual, persistidos em
// 'locatem_pagamento_cartao'. Nunca inclui número completo, CVV ou senha.
export interface CartaoPagamentoArmazenado {
  id: string;
  bandeira: string;
  ultimosDigitos: string;
}
// Tipos compartilhados do fluxo de seleção/cadastro de cartão (Pagamento)

export type MetodoPagamento = 'credito' | 'debito';

export interface Cartao {
  id: number;
  metodoPagamento: MetodoPagamento;
  bandeira: string;
  final: string;
  titular: string;
}

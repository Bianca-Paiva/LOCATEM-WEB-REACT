// Tipos compartilhados do fluxo de Carrinho / Pagamento

export interface CarrinhoItemData {
  id: string;
  title: string;
  image: string;
  dias: number;
  voltagem: string;
  precoUnitario: number;
  quantidade: number;
}
``

export interface LojaGroupData {
  id: string;
  nomeLoja: string; // ex: "Produto de JB Ferramentas"
  lojaOficialDe: string; // ex: "Dewalt"
  verificado: boolean;
  itens: CarrinhoItemData[];
}

export type ResumoPedidoVariant = 'vazio' | 'carrinho' | 'pagamento';

export interface PrazoPagamento {
  texto: string; // ex: "17 de abril 2026, 15:41"
  expirado?: boolean;
}

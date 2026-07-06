/**
    * Tipos do fluxo de Avaliações.
    * Centralizados aqui para serem reaproveitados pela página, pelos componentes e pelos hooks relacionados.
 */

export type StatusAvaliacao = 'pendente' | 'realizada';

export type ChaveSubAvaliacao = 'locador' | 'entrega' | 'produto';

export interface SubAvaliacoes {
    locador: number;
    entrega: number;
    produto: number;
}

export interface LojaProduto {
    nome: string;
    logo: string;
}

export interface ProdutoAvaliacao {
    id: number;
    nome: string;
    dataLocacao: string;
    imagem: string;
    status: StatusAvaliacao;
    notaGlobal: number;
    subAvaliacoes: SubAvaliacoes;
    observacao: string;
    loja: LojaProduto;
}

export type AbaAvaliacao = 'pendentes' | 'realizadas';

/** Labels e ícones usados nas 3 categorias de sub-avaliação do modal. */
export const LABEL_SUB_AVALIACAO: Record<ChaveSubAvaliacao, string> = {
    locador: 'Avaliação Locador',
    entrega: 'Avaliação Entrega',
    produto: 'Avaliação Produto',
};
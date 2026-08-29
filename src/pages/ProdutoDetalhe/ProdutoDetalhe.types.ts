/**
    * Tipos do fluxo de Detalhe do Produto.
    * Centralizados aqui para serem reaproveitados pela página, pelos componentes e pelos hooks relacionados.
 */

export interface ProdutoSemelhante {
    id: number;
    title: string;
    marca: string;
    price: string;
    images: string[];
    image: string;
    imageVerificado: string;
    imageNota: string;
    rating: number;
    reviewCount: number;
    locador: string;
    localizacao: string;
    categoria: string;
    estoqueDisponivel: number;
}

export interface EspecificacaoTecnica {
    label: string;
    valor: string;
}

export interface AvaliacaoProduto {
    nome: string;
    rating: number;
    tempo: string;
    texto: string;
    fotos: string[];
    utilCount: number;
}
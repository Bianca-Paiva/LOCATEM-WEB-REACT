import type { Produto } from '../types/produto.types';
import type { ProdutoHome } from '../pages/Home/Home.types';
import type { ProdutoBusca } from '../pages/Busca/Busca.types';
import type { ProdutoSemelhante } from '../pages/ProdutoDetalhe/ProdutoDetalhe.types';
import type { ProdutoSelecionado } from '../context/ProdutoContext';
import type { LocacaoData } from '../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';

/**
 * Adapters: convertem o Produto central (com todos os campos) para o formato "recortado" que cada página/componente realmente usa.
 *
 * Isso mantém cada tela recebendo só os dados que exibe, sem duplicar o mock em si — a fonte dos dados continua sendo `produtos.mock.ts`.
 */

export const toProdutoHome = (p: Produto): ProdutoHome => ({
    id: p.id,
    title: p.title,
    marca: p.marca,
    locador: p.locador,
    price: p.price,
    images: p.images,
    imageVerificado: p.imageVerificado,
    imageNota: p.imageNota,
    rating: p.rating,
    reviewCount: p.reviewCount,
    tipoAprovacao: p.tipoAprovacao,
});

export const toProdutoBusca = (p: Produto): ProdutoBusca => ({
    id: p.id,
    title: p.title,
    marca: p.marca,
    category: p.categoria,
    price: p.price,
    images: p.images,
    imageVerificado: p.imageVerificado,
    imageNota: p.imageNota,
    rating: p.rating,
    reviewCount: p.reviewCount,
    paymentMethods: p.paymentMethods,
    available: p.available,
    locador: p.locador,
    localizacao: p.localizacao,
    estoqueDisponivel: p.estoqueDisponivel,
    voltagem: p.voltagem,
});

export const toProdutoSemelhante = (p: Produto): ProdutoSemelhante => ({
    id: p.id,
    title: p.title,
    marca: p.marca,
    price: p.price,
    images: p.images,
    image: p.images[0],
    imageVerificado: p.imageVerificado,
    imageNota: p.imageNota,
    rating: p.rating,
    reviewCount: p.reviewCount,
    locador: p.locador,
    localizacao: p.localizacao,
    categoria: p.categoria,
    estoqueDisponivel: p.estoqueDisponivel,
});

export const toProdutoSelecionado = (p: Produto): ProdutoSelecionado => ({
    id: p.id,
    title: p.title,
    marca: p.marca,
    price: p.price,
    images: p.images,
    imageVerificado: p.imageVerificado,
    imageNota: p.imageNota,
    rating: p.rating,
    reviewCount: p.reviewCount,
    locador: p.locador,
    localizacao: p.localizacao,
    categoria: p.categoria,
    estoqueDisponivel: p.estoqueDisponivel,
    diasIndisponiveis: p.diasIndisponiveis,
    tipoAprovacao: p.tipoAprovacao,
    voltagem: p.voltagem,
    descricao: p.descricao,
    especificacoes: p.especificacoes,
    acessorios: p.acessorios,
    avaliacoes: p.avaliacoes,
    distribuicaoAvaliacoes: p.distribuicaoAvaliacoes,
});

/**
 * Subconjunto de campos de uma Locacao que vêm diretamente do produto (ferramenta, imagem, categoria, avaliações, localização e locador).
 * Os demais campos de `LocacaoData` (período, status, datas, quantidade, valor etc.) são específicos da solicitação de locacao em si.
 */
export type LocacaoProdutoBase = Pick<
    LocacaoData,
    'produto' | 'imagem' | 'categoria' | 'avaliacaoLocador' | 'numeroAvaliacoes' | 'localizacao' | 'locador'
>;

export const toLocacaoProdutoBase = (p: Produto): LocacaoProdutoBase => ({
    produto: p.title,
    imagem: p.images[0],
    categoria: p.categoria,
    avaliacaoLocador: p.rating,
    numeroAvaliacoes: p.reviewCount,
    localizacao: p.localizacao,
    locador: p.locador,
});
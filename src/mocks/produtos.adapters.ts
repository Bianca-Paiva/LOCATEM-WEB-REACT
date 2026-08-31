import type { Produto } from '../types/produto.types';
import type { ProdutoHome } from '../pages/Home/Home.types';
import type { ProdutoBusca } from '../pages/Busca/Busca.types';
import type { ProdutoSemelhante } from '../pages/ProdutoDetalhe/ProdutoDetalhe.types';
import type { ProdutoSelecionado } from '../context/ProdutoContext';
import type { LocacaoData } from '../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import { calcularResumoAvaliacoes } from '../utils/avaliacoesResumo';

/**
 * Adapters: convertem o Produto central (com todos os campos) para o formato "recortado" que cada página/componente realmente usa.
 *
 * Isso mantém cada tela recebendo só os dados que exibe, sem duplicar o mock em si — a fonte dos dados continua sendo `produtos.mock.ts`.
 */

export const toProdutoHome = (p: Produto): ProdutoHome => {
    // Média e quantidade sempre calculadas a partir das avaliações reais da ferramenta, nunca dos campos fixos do mock (ver utils/avaliacoesResumo.ts).
    const { media, quantidade } = calcularResumoAvaliacoes(p.avaliacoes);

    return {
        id: p.id,
        title: p.title,
        marca: p.marca,
        locador: p.locador,
        price: p.price,
        images: p.images,
        imageVerificado: p.imageVerificado,
        imageNota: p.imageNota,
        rating: media,
        reviewCount: quantidade,
        tipoAprovacao: p.tipoAprovacao,
    };
};

export const toProdutoBusca = (p: Produto): ProdutoBusca => {
    const { media, quantidade } = calcularResumoAvaliacoes(p.avaliacoes);

    return {
        id: p.id,
        title: p.title,
        marca: p.marca,
        category: p.categoria,
        price: p.price,
        images: p.images,
        imageVerificado: p.imageVerificado,
        imageNota: p.imageNota,
        rating: media,
        reviewCount: quantidade,
        paymentMethods: p.paymentMethods,
        available: p.available,
        locador: p.locador,
        localizacao: p.localizacao,
        estoqueDisponivel: p.estoqueDisponivel,
        voltagem: p.voltagem,
    };
};

export const toProdutoSemelhante = (p: Produto): ProdutoSemelhante => {
    const { media, quantidade } = calcularResumoAvaliacoes(p.avaliacoes);

    return {
        id: p.id,
        title: p.title,
        marca: p.marca,
        price: p.price,
        images: p.images,
        image: p.images[0],
        imageVerificado: p.imageVerificado,
        imageNota: p.imageNota,
        rating: media,
        reviewCount: quantidade,
        locador: p.locador,
        localizacao: p.localizacao,
        categoria: p.categoria,
        estoqueDisponivel: p.estoqueDisponivel,
    };
};

export const toProdutoSelecionado = (p: Produto): ProdutoSelecionado => {
    // Página de Produto: média, quantidade e distribuição por estrela vêm todas do mesmo cálculo sobre `p.avaliacoes`, para nunca divergir entre si.
    const { media, quantidade, distribuicao } = calcularResumoAvaliacoes(p.avaliacoes);

    return {
        id: p.id,
        title: p.title,
        marca: p.marca,
        price: p.price,
        images: p.images,
        imageVerificado: p.imageVerificado,
        imageNota: p.imageNota,
        rating: media,
        reviewCount: quantidade,
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
        distribuicaoAvaliacoes: distribuicao,
    };
};

/**
 * Subconjunto de campos de uma Locação que vêm diretamente do produto (ferramenta, imagem, categoria, avaliações, localização e locador).
 * Os demais campos de `LocacaoData` (período, status, datas, quantidade, valor etc.) são específicos da solicitação de locação em si.
 */
export type LocacaoProdutoBase = Pick<
    LocacaoData,
    'produto' | 'imagem' | 'categoria' | 'avaliacaoLocador' | 'numeroAvaliacoes' | 'localizacao' | 'locador'
>;

export const toLocacaoProdutoBase = (p: Produto): LocacaoProdutoBase => {
    const { media, quantidade } = calcularResumoAvaliacoes(p.avaliacoes);

    return {
        produto: p.title,
        imagem: p.images[0],
        categoria: p.categoria,
        avaliacaoLocador: media,
        numeroAvaliacoes: quantidade,
        localizacao: p.localizacao,
        locador: p.locador,
    };
};
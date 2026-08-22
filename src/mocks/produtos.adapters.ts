import type { Produto } from '../types/produto.types';
import type { ProdutoHome } from '../pages/Home/Home.types';
import type { ProdutoBusca } from '../pages/Busca/Busca.types';
import type { ProdutoSemelhante } from '../pages/ProdutoDetalhe/ProdutoDetalhe.types';
import type { ProdutoSelecionado } from '../context/ProdutoContext';
import type { ReservaData } from '../pages/Reservas/MinhasReservas/MinhasReservas.types';

/**
 * Adapters: convertem o Produto central (com todos os campos) para o
 * formato "recortado" que cada página/componente realmente usa.
 *
 * Isso mantém cada tela recebendo só os dados que exibe, sem duplicar
 * o mock em si — a fonte dos dados continua sendo `produtos.mock.ts`.
 */

export const toProdutoHome = (p: Produto): ProdutoHome => ({
    id: p.id,
    title: p.title,
    brand: p.brand,
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
    brand: p.brand,
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
});

export const toProdutoSemelhante = (p: Produto): ProdutoSemelhante => ({
    id: p.id,
    title: p.title,
    brand: p.brand,
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
    brand: p.brand,
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
});

/**
 * Subconjunto de campos de uma Reserva que vêm diretamente do produto
 * (ferramenta, imagem, categoria, avaliações, localização e locador).
 * Os demais campos de `ReservaData` (período, status, datas, quantidade,
 * valor etc.) são específicos da solicitação de reserva em si.
 */
export type ReservaProdutoBase = Pick<
    ReservaData,
    'produto' | 'imagem' | 'categoria' | 'avaliacaoLocador' | 'numeroAvaliacoes' | 'localizacao' | 'locador'
>;

export const toReservaProdutoBase = (p: Produto): ReservaProdutoBase => ({
    produto: p.title,
    imagem: p.images[0],
    categoria: p.categoria,
    avaliacaoLocador: p.rating,
    numeroAvaliacoes: p.reviewCount,
    localizacao: p.localizacao,
    locador: p.locador,
});
import type { ProdutoAvaliacao } from './Avaliacao.types';

/**
 * Mock temporário para testes de layout e fluxo da página de avaliação.
 */
export const produtosAvaliacaoMock: ProdutoAvaliacao[] = [
    {
        id: 1,
        nome: 'Furadeira Parafusadeira The Black Tools',
        dataLocacao: 'Locado em 02 de ago.',
        imagem: 'https://http2.mlstatic.com/D_Q_NP_836965-MLA108103121007_032026-B.webp',
        status: 'pendente',
        notaGlobal: 0,
        subAvaliacoes: { locador: 0, entrega: 0, produto: 0 },
        observacao: '',
        loja: { nome: 'Makita', logo: '/src/assets/images/makitaLogo.png' },
    },
    {
        id: 2,
        nome: 'Serra Mármore Corte Seco 1450w 4100 Nh2z Makito',
        dataLocacao: 'Locado em 25 de Jul.',
        imagem: 'https://http2.mlstatic.com/D_NQ_NP_701344-MLB77327889785_072024-O.webp',
        status: 'pendente',
        notaGlobal: 0,
        subAvaliacoes: { locador: 0, entrega: 0, produto: 0 },
        observacao: '',
        loja: { nome: 'Makita', logo: '/src/assets/images/makitaLogo.png' },
    },
];
import type { ProdutoAvaliacao } from './Avaliacao.types';
import { obterLogoLocador } from './logoLocador';
import FuradeiraTheBlackTools from '../../assets/ProdutosImg/FuradeiraTheBlackTools.png';
import SerraMarmoreMakita from '../../assets/ProdutosImg/serraMarmoreMakita.png';

/**
    * Mock temporário para testes de layout e fluxo da página de avaliação.
 */
export const produtosAvaliacaoMock: ProdutoAvaliacao[] = [
    {
        id: '1',
        nome: 'Furadeira Parafusadeira The Black Tools',
        dataLocacao: 'Locado em 02 de Agosto',
        imagem: FuradeiraTheBlackTools,
        status: 'pendente',
        notaGlobal: 0,
        subAvaliacoes: { locador: 0, entrega: 0, produto: 0 },
        observacao: '',
        loja: { nome: 'MS Ferramentas', logo: obterLogoLocador('MS Ferramentas') },
    },
    {
        id: '2',
        nome: 'Serra Mármore Corte Seco 1450w 4100 Nh2z Makita',
        dataLocacao: 'Locado em 25 de Julho',
        imagem: SerraMarmoreMakita,
        status: 'pendente',
        notaGlobal: 0,
        subAvaliacoes: { locador: 0, entrega: 0, produto: 0 },
        observacao: '',
        loja: { nome: 'JB Ferramentas', logo: obterLogoLocador('JB Ferramentas') },
    },
];
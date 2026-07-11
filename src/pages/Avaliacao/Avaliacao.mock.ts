import type { ProdutoAvaliacao } from './Avaliacao.types';
import FuradeiraTheBlackTools from '../../assets/ProdutosImg/FuradeiraTheBlackTools.png';
import MsFerramentasLogo from '../../assets/LogosLojas/logoLojaMS.png';

import SerraMarmoreMakita from '../../assets/ProdutosImg/serraMarmoreMakita.png';
import JbFerramentasLogo from '../../assets/LogosLojas/logoLojaJB.png';

/**
    * Mock temporário para testes de layout e fluxo da página de avaliação.
 */
export const produtosAvaliacaoMock: ProdutoAvaliacao[] = [
    {
        id: 1,
        nome: 'Furadeira Parafusadeira The Black Tools',
        dataLocacao: 'Locado em 02 de Agosto',
        imagem: FuradeiraTheBlackTools,
        status: 'pendente',
        notaGlobal: 0,
        subAvaliacoes: { locador: 0, entrega: 0, produto: 0 },
        observacao: '',
        loja: { nome: 'Ms Ferramentas', logo: MsFerramentasLogo },
    },
    {
        id: 2,
        nome: 'Serra Mármore Corte Seco 1450w 4100 Nh2z Makita',
        dataLocacao: 'Locado em 25 de Julho',
        imagem: SerraMarmoreMakita,
        status: 'pendente',
        notaGlobal: 0,
        subAvaliacoes: { locador: 0, entrega: 0, produto: 0 },
        observacao: '',
        loja: { nome: 'JB Ferramentas', logo: JbFerramentasLogo },
    },
];
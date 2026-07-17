import type { ProdutoSemelhante, EspecificacaoTecnica, AvaliacaoProduto } from './ProdutoDetalhe.types';

/**
    * Mock temporário para testes de layout e fluxo da página de detalhe do produto.
 */

// ── Dados estáticos de fallback (exibidos quando não há produto no store) ──────
export const FALLBACK_PRODUTO = {
    title: 'Furadeira Parafusadeira Sem Fio A Bateria Tb-12e 12v 3/8 10mm Com Maleta E Acessórios The Black Tools',
    brand: 'JB Ferramentas',
    price: '15',
    rating: 4.8,
    reviewCount: 3,
    images: [
        'src/assets/ProdutosImg/FuradeiraTheBlackTools.png',
        'src/assets/ProdutosImg/FuradeiraTheBlackTools2.png',
    ],
    imageVerificado: 'src/assets/verificadoAzul.png',
    imageNota: 'src/assets/StarFullYellow.png',
    locador: 'MS Ferramentas',
    localizacao: 'São Paulo - SP',
    categoria: 'Elétrica • Parafusadeira/Furadeira',
    estoqueDisponivel: 5,
};

export const MOCK_SEMELHANTES: ProdutoSemelhante[] = [
    {
        id: 10,
        title: 'Aparador De Grama Bipartido Tramontina',
        brand: 'JB Ferramentas',
        price: '18,00',
        images: [
            'src/assets/ProdutosImg/aparadorGrama.png',
            'src/assets/ProdutosImg/aparadorGrama.png'
        ],
        image: 'src/assets/ProdutosImg/aparadorGrama.png',
        imageVerificado: 'src/assets/verificadoAzul.png',
        imageNota: 'src/assets/StarFullYellow.png',
        rating: 4.6,
        reviewCount: 28,
        locador: 'JB Ferramentas',
        localizacao: 'Guarulhos - SP',
        categoria: 'Jardinagem • Aparador de Grama',
        estoqueDisponivel: 6,
    },
    {
        id: 11,
        title: 'Pistola de Pintura Profissional',
        brand: 'WZ Ferramentas',
        price: '30,00',
        images: [
            'src/assets/ProdutosImg/pistolaPintura.png',
            'src/assets/ProdutosImg/pistolaPintura.png'
        ],
        image: 'src/assets/ProdutosImg/pistolaPintura.png',
        imageVerificado: 'src/assets/verificadoAzul.png',
        imageNota: 'src/assets/StarFullYellow.png',
        rating: 4.2,
        reviewCount: 87,
        locador: 'WZ Ferramentas',
        localizacao: 'Campinas - SP',
        categoria: 'Elétrica • Pintura',
        estoqueDisponivel: 4,
    },
    {
        id: 12,
        title: 'Parafusadeira Furadeira de Impacto Hanabi',
        brand: 'João Ferramentas',
        price: '28,00',
        images: [
            'src/assets/ProdutosImg/FuradeiraHanabi.png',
            'src/assets/ProdutosImg/FuradeiraHanabi.png'
        ],
        image: 'src/assets/ProdutosImg/FuradeiraHanabi.png',
        imageVerificado: 'src/assets/verificadoAzul.png',
        imageNota: 'src/assets/StarFullYellow.png',
        rating: 4.7,
        reviewCount: 201,
        locador: 'João Ferramentas',
        localizacao: 'São Paulo - SP',
        categoria: 'Elétrica • Parafusadeira/Furadeira',
        estoqueDisponivel: 3,
    },
    {
        id: 13,
        title: 'Serra Circular Profissional DESOON 24 Dentes',
        brand: 'JB Ferramentas',
        price: '18,00',
        images: [
            'src/assets/ProdutosImg/serraCircularProfissional.png',
            'src/assets/ProdutosImg/serraCircularProfissional.png'
        ],
        image: 'src/assets/ProdutosImg/serraCircularProfissional.png',
        imageVerificado: 'src/assets/verificadoAzul.png',
        imageNota: 'src/assets/StarFullYellow.png',
        rating: 4.4,
        reviewCount: 76,
        locador: 'Carlos Silva',
        localizacao: 'São Paulo - SP',
        categoria: 'Elétrica • Serra',
        estoqueDisponivel: 2,
    },
    {
        id: 14,
        title: 'Parafusadeira e Furadeira WAP 12V',
        brand: 'JB Ferramentas',
        price: '18,00',
        images: [
            'src/assets/ProdutosImg/FuradeiraWapCinza.png',
            'src/assets/ProdutosImg/FuradeiraWapCinza.png'
        ],
        image: 'src/assets/ProdutosImg/FuradeiraWapCinza.png',
        imageVerificado: 'src/assets/verificadoAzul.png',
        imageNota: 'src/assets/StarFullYellow.png',
        rating: 4.3,
        reviewCount: 62,
        locador: 'JB Ferramentas',
        localizacao: 'Osasco - SP',
        categoria: 'Elétrica • Parafusadeira/Furadeira',
        estoqueDisponivel: 5,
    },
];

export const MOCK_ESPECIFICACOES: EspecificacaoTecnica[] = [
    { label: 'Potência de saída', valor: 'Bateria de Íon-lítio de 18V máx' },
    { label: 'Torque máximo', valor: '65 Nm' },
    { label: 'Tamanho do mandril', valor: '13mm Sem chave' },
    { label: 'Acessórios incluídos', valor: '2 baterias, carregador, estojo rígido, conjunto de 10 bits' },
];

export const MOCK_AVALIACOES: AvaliacaoProduto[] = [
    {
        nome: 'João Silva',
        rating: 5,
        tempo: 'Há 2 dias',
        texto: 'Furadeira muito boa, usei pra montar um guarda-roupa inteiro. Super potente e a bateria durou o projeto todo.',
        fotos: ['src/assets/ProdutosImg/FuradeiraTheBlackTools.png', 'src/assets/ProdutosImg/FuradeiraTheBlackTools.png', 'src/assets/ProdutosImg/FuradeiraTheBlackTools.png'],
        utilCount: 12,
    },
    {
        nome: 'Maria Souza',
        rating: 5,
        tempo: 'Há 1 semana',
        texto: 'O equipamento foi perfeito. O atendimento na entrega foi excelente também.',
        fotos: [],
        utilCount: 5,
    },
    {
        nome: 'Pedro Ribeiro',
        rating: 4,
        tempo: 'Há 2 semanas',
        texto: 'Máquina limpa e pronta para uso. Recomendo.',
        fotos: [],
        utilCount: 2,
    },
];
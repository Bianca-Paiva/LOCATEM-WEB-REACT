import type { ProdutoHome } from './Home.types';

/**
    * Mock temporário para testes de layout e fluxo da página Home.
 */
export const MOCK_PRODUCTS: ProdutoHome[] = [
    {
        id: 1,
        title: 'Furadeira Parafusadeira The Black Tools',
        brand: 'MS Ferramentas',
        price: '15,00',
        images: [
            'src/assets/ProdutosImg/FuradeiraTheBlackTools.png',
            'src/assets/ProdutosImg/FuradeiraTheBlackTools2.png', // Foto 2 de exemplo
            'src/assets/ProdutosImg/FuradeiraTheBlackTools3.png'  // Foto 3 de exemplo
        ],
        imageVerificado: 'src/assets/verificadoAzul.png',
        imageNota: 'src/assets/StarFullYellow.png',
        rating: 4.5,
        reviewCount: 124,
    },
    {
        id: 2,
        title: 'Pistola de Pintura The Black Tools',
        brand: 'WZ Ferramentas',
        price: '30,00',
        images: [
            'src/assets/ProdutosImg/pistolaPintura.png',
            'src/assets/ProdutosImg/pistolaPintura.png'
        ],
        imageVerificado: 'src/assets/verificadoAzul.png',
        imageNota: 'src/assets/StarFullYellow.png',
        rating: 4.2,
        reviewCount: 87,
    },
    {
        id: 3,
        title: 'Parafusadeira Furadeira de Impacto Hanabi',
        brand: 'João Ferramentas',
        price: '28,00',
        images: [
            'src/assets/ProdutosImg/FuradeiraHanabi.png',
            'src/assets/ProdutosImg/FuradeiraHanabi.png'
        ],
        imageVerificado: 'src/assets/verificadoAzul.png',
        imageNota: 'src/assets/StarFullYellow.png',
        rating: 4.7,
        reviewCount: 201,
    },
    {
        id: 4,
        title: 'Aparador De Grama Bipartido Tramontina',
        brand: 'JB Ferramentas',
        price: '18,00',
        images: [
            'src/assets/ProdutosImg/aparadorGrama.png',
            'src/assets/ProdutosImg/aparadorGrama.png'
        ],
        imageVerificado: 'src/assets/verificadoAzul.png',
        imageNota: 'src/assets/StarFullYellow.png',
        rating: 4.1,
        reviewCount: 45,
    },
    {
        id: 5,
        title: 'Parafusadeira e Furadeira WAP 12V',
        brand: 'JB Ferramentas',
        price: '18,00',
        images: [
            'src/assets/ProdutosImg/FuradeiraWapCinza.png',
            'src/assets/ProdutosImg/FuradeiraWapCinza.png'
        ],
        imageVerificado: 'src/assets/verificadoAzul.png',
        imageNota: 'src/assets/StarFullYellow.png',
        rating: 4.3,
        reviewCount: 62,
    },
    {
        id: 6,
        title: 'Parafusadeira e Furadeira WAP BPF 12V',
        brand: 'JB Ferramentas',
        price: '18,00',
        images: [
            'src/assets/ProdutosImg/FuradeiraWapCinza.png',
            'src/assets/ProdutosImg/FuradeiraWapCinza.png'
        ],
        imageVerificado: 'src/assets/verificadoAzul.png',
        imageNota: 'src/assets/StarFullYellow.png',
        rating: 4.0,
        reviewCount: 38,
    },
    {
        id: 7,
        title: 'Serra circular profissional DESOON 24 Dentes',
        brand: 'JB Ferramentas',
        price: '18,00',
        images: [
            'src/assets/ProdutosImg/serraCircularProfissional.png',
            'src/assets/ProdutosImg/serraCircularProfissional.png'
        ],
        imageVerificado: 'src/assets/verificadoAzul.png',
        imageNota: 'src/assets/StarFullYellow.png',
        rating: 4.6,
        reviewCount: 153,
    },
    {
        id: 8,
        title: 'Parafusadeira e furadeira WAP 12V Cinza',
        brand: 'JB Ferramentas',
        price: '18,00',
        images: [
            'src/assets/ProdutosImg/FuradeiraWapPreta.png',
            'src/assets/ProdutosImg/FuradeiraWapPreta.png'
        ],
        imageVerificado: 'src/assets/verificadoAzul.png',
        imageNota: 'src/assets/StarFullYellow.png',
        rating: 3.9,
        reviewCount: 27,
    },
];
import Header from '../../components/Header/Header';
import { Banner } from '../../components/Banner/Banner';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { useProdutoStore } from '../../store/produtoStore';
import type { Route } from '../../router/useRouter';
import { useState } from 'react';
import { ButtonOrder } from '../../components/Busca/OrderButton/OrderButton';
import { SideBarBusca } from '../../components/Busca/SideBarBusca/SideBarBusca';
import Paginacao from '../../components/Busca/Paginacao/Paginacao';
import './Busca.css';

const MOCK_PRODUCTS = [
  {
    id: 1,
    title: 'Furadeira Parafusadeira Impacto 1/2',
    brand: 'Bosch',
    category: 'Ferramentas Elétricas',
    price: '45,00',
    image: 'src/assets/Furadeira1.webp',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.5,
    reviewCount: 124,
    paymentMethods: ['Cartão de Crédito', 'Pix'],
    available: true,
  },
  {
    id: 2,
    title: 'Pistola de Pintura Profissional',
    brand: 'Black & Decker',
    category: 'Ferramentas Elétricas',
    price: '30,00',
    image: 'src/assets/pistolaPintura.png',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.2,
    reviewCount: 87,
    paymentMethods: ['Cartão de Crédito', 'Boleto Bancário', 'Pix'],
    available: true,
  },
  {
    id: 3,
    title: 'Chave de Fenda Hidráulica Manual',
    brand: 'Makita',
    category: 'Ferramentas Manuais',
    price: '15,00',
    image: 'src/assets/Furadeira3.webp',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 3.7,
    reviewCount: 201,
    paymentMethods: ['Pix', 'Transferência Bancária'],
    available: false,
  },
  {
    id: 4,
    title: 'Aparador De Grama Bipartido',
    brand: 'DeWalt',
    category: 'Equipamentos de Jardinagem',
    price: '85,00',
    image: 'src/assets/aparadorGrama.webp',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.1,
    reviewCount: 45,
    paymentMethods: ['Cartão de Crédito'],
    available: true,
  },
  {
    id: 5,
    title: 'Serra Tico-Tico de Bancada',
    brand: 'Bosch',
    category: 'Ferramentas Elétricas',
    price: '50,00',
    image: 'src/assets/parafusadeira-furadeira-WAP.webp',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.4,
    reviewCount: 76,
    paymentMethods: ['Cartão de Crédito', 'Pix'],
    available: true,
  },
  {
    id: 6,
    title: 'Kit Chaves Combinadas Premium',
    brand: 'DeWalt',
    category: 'Ferramentas Manuais',
    price: '25,00',
    image: 'src/assets/aparadorGrama.webp',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.6,
    reviewCount: 153,
    paymentMethods: ['Cartão de Crédito', 'Pix'],
    available: false,
  },
  {
    id: 7,
    title: 'Cortador de Grama Dirigível',
    brand: 'Black & Decker',
    category: 'Equipamentos de Jardinagem',
    price: '210,00',
    image: 'src/assets/parafusadeira-wap.png',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 2.9,
    reviewCount: 27,
    paymentMethods: ['Cartão de Crédito', 'Boleto Bancário'],
    available: true,
  },
  {
    id: 8,
    title: 'Parafusadeira Furadeira de Impacto Hanabi',
    brand: 'Makita',
    category: 'Ferramentas Elétricas',
    price: '28,00',
    image: 'src/assets/Furadeira3.webp',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.7,
    reviewCount: 201,
    paymentMethods: ['Pix'],
    available: true,
  },
  {
    id: 9,
    title: 'Parafusadeira e Furadeira WAP 12V',
    brand: 'WAP',
    category: 'Ferramentas Elétricas',
    price: '18,00',
    image: 'src/assets/Furadeira4.webp',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.3,
    reviewCount: 62,
    paymentMethods: ['Cartão de Crédito', 'Pix'],
    available: true,
  },
  {
    id: 10,
    title: 'Parafusadeira e Furadeira WAP BPF 12V',
    brand: 'WAP',
    category: 'Ferramentas Elétricas',
    price: '18,00',
    image: 'src/assets/parafusadeira-furadeira-WAP.webp',
    imageVerificado: 'src/assets/verificado.png',
    imageNota: 'src/assets/StarFull.png',
    rating: 4.0,
    reviewCount: 38,
    paymentMethods: ['Cartão de Crédito'],
    available: true,
  },
];

interface BuscaProps {
  navigate: (route: Route) => void;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  brandSearch: string;
  priceRanges: string[];
  paymentMethods: string[];
  availability: string | null;
  minRating: number | null;
}

export default function Busca({ navigate }: BuscaProps) {
  const { setProdutoSelecionado } = useProdutoStore();

  const [sortOrder, setSortOrder] = useState('menor-preco');
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  const [activeFilters, setActiveFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    brandSearch: '',
    priceRanges: [],
    paymentMethods: [],
    availability: null,
    minRating: null,
  });

  const sortOptions = [
    { value: 'relevancia', label: 'Relevância' },
    { value: 'maior-preco', label: 'Preço: Maior preço' },
    { value: 'menor-preco', label: 'Preço: Menor preço' },
    { value: 'melhores-avaliacoes', label: 'Melhores avaliações' },
    { value: 'novidades', label: 'Novidades' },
  ];

  const handleCardClick = (product: typeof MOCK_PRODUCTS[0]) => {
    setProdutoSelecionado({
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      image: product.image,
      imageVerificado: product.imageVerificado,
      imageNota: product.imageNota,
      rating: product.rating,
      reviewCount: product.reviewCount,
    });
    navigate('produtoDetalhe');
  };

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const productPrice = parseFloat(product.price.replace(',', '.'));

    if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(product.category)) return false;
    if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(product.brand)) return false;
    if (activeFilters.brandSearch && !product.brand.toLowerCase().includes(activeFilters.brandSearch.toLowerCase())) return false;

    if (activeFilters.priceRanges.length > 0) {
      const matchRange = activeFilters.priceRanges.some((range) => {
        if (range === 'R$0 - R$50') return productPrice >= 0 && productPrice <= 50;
        if (range === 'R$51 - R$100') return productPrice >= 51 && productPrice <= 100;
        if (range === 'R$101 - R$200') return productPrice >= 101 && productPrice <= 200;
        if (range === 'R$201+') return productPrice > 200;
        return false;
      });
      if (!matchRange) return false;
    }

    if (activeFilters.paymentMethods.length > 0) {
      const matchPayment = product.paymentMethods.some((method) => activeFilters.paymentMethods.includes(method));
      if (!matchPayment) return false;
    }

    if (activeFilters.availability) {
      if (activeFilters.availability === 'Disponível para Aluguel' && !product.available) return false;
      if (activeFilters.availability === 'Indisponível para Aluguel' && product.available) return false;
    }

    if (activeFilters.minRating !== null && product.rating < activeFilters.minRating) return false;

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseFloat(a.price.replace(',', '.'));
    const priceB = parseFloat(b.price.replace(',', '.'));
    if (sortOrder === 'menor-preco') return priceA - priceB;
    if (sortOrder === 'maior-preco') return priceB - priceA;
    if (sortOrder === 'melhores-avaliacoes') return b.rating - a.rating;
    return 0;
  });

  const totalItems = sortedProducts.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="busca-container">
      <Header navigate={navigate} currentRoute="busca" />

      <main className="busca-main">
        <div className="busca-layout">

          <div className="busca-content-main">
            <Banner />

            <div className="busca-controls-container">
              <div className="order-button-container">
                <ButtonOrder
                  value={sortOrder}
                  onChange={(val) => {
                    setSortOrder(val);
                    setCurrentPage(1);
                  }}
                  options={sortOptions}
                />
              </div>

              <button
                className="mobile-filter-trigger-btn"
                onClick={() => setIsFilterMobileOpen(true)}
              >
                <span>Filtrar</span>
              </button>
            </div>

            <div className="products-grid">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    title={product.title}
                    brand={product.brand}
                    price={product.price}
                    image={product.image}
                    imageVerificado={product.imageVerificado}
                    imageNota={product.imageNota}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    onNavigate={() => handleCardClick(product)}
                  />
                ))
              ) : (
                <p className="no-products-message">Nenhum produto encontrado com os filtros selecionados.</p>
              )}
            </div>

            <Paginacao
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>

          <SideBarBusca
            isOpen={isFilterMobileOpen}
            onClose={() => setIsFilterMobileOpen(false)}
            onApplyFilters={(filters) => {
              setActiveFilters(filters);
              setCurrentPage(1);
              setIsFilterMobileOpen(false);
            }}
          />

        </div>
      </main>
    </div>
  );
}
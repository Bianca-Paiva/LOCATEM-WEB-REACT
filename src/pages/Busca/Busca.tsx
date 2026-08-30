import Header from '../../components/Header/Header';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { useProdutoStore } from '../../hooks/useProdutoStore';
import { useCatalogoStore } from '../../hooks/useCatalogoStore';
import { useBuscaStore } from '../../hooks/useBuscaStore';
import type { Route } from '../../router/useRouter';
import { useMemo, useState } from 'react';
import { ButtonOrder } from '../../components/Busca/OrderButton/OrderButton';
import { SideBarBusca } from '../../components/Busca/SideBarBusca/SideBarBusca';
import Paginacao from '../../components/Busca/Paginacao/Paginacao';
import { toProdutoBusca } from '../../mocks/produtos.adapters';
import type { ProdutoBusca, FilterState } from './Busca.types';
import styles from './Busca.module.css';

interface BuscaProps {
  navigate: (route: Route) => void;
}

export default function Busca({ navigate }: BuscaProps) {
  const { setProdutoSelecionado } = useProdutoStore();
  const { produtos } = useCatalogoStore();
  // Termo pesquisado na barra de busca do Header (funciona em qualquer tela).
  const { termoBusca } = useBuscaStore();

  // Catálogo de busca (ids 15-24) + ferramentas recém-publicadas pelo usuário.
  const produtosBuscaMock = useMemo(
    () =>
      produtos
        .filter((p) => p.meuAnuncio || (p.id >= 15 && p.id <= 24))
        .map(toProdutoBusca),
    [produtos],
  );

  const [sortOrder, setSortOrder] = useState('menor-preco');
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  // Sempre que o usuário pesquisar um novo termo (a partir de qualquer tela),
  // volta pra primeira página pra não deixar a paginação "presa" fora do range.
  // Ajustado durante a renderização (em vez de um useEffect) pra evitar re-render em cascata.
  const [termoBuscaAnterior, setTermoBuscaAnterior] = useState(termoBusca);
  if (termoBusca !== termoBuscaAnterior) {
    setTermoBuscaAnterior(termoBusca);
    setCurrentPage(1);
  }

  const [activeFilters, setActiveFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    brandSearch: '',
    voltagens: [],
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



  const handleCardClick = (product: ProdutoBusca) => {
    setProdutoSelecionado({
      id: product.id,
      title: product.title,
      marca: product.marca,
      price: product.price,
      images: product.images,
      imageVerificado: product.imageVerificado,
      imageNota: product.imageNota,
      rating: product.rating,
      reviewCount: product.reviewCount,
      locador: product.locador,
      localizacao: product.localizacao,
      categoria: product.category,
      estoqueDisponivel: product.estoqueDisponivel,
    });
    navigate('produtoDetalhe');
  };

  const filteredProducts = produtosBuscaMock.filter((product) => {
    const productPrice = parseFloat(product.price.replace(',', '.'));

    if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(product.category)) return false;
    if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(product.marca)) return false;
    if (activeFilters.brandSearch && !product.marca.toLowerCase().includes(activeFilters.brandSearch.toLowerCase())) return false;

    if (activeFilters.voltagens.length > 0) {
      if (!product.voltagem || !activeFilters.voltagens.includes(product.voltagem)) return false;
    }

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

    if (termoBusca) {
      const termo = termoBusca.toLowerCase();
      const correspondeTermo =
        product.title.toLowerCase().includes(termo) ||
        product.marca.toLowerCase().includes(termo) ||
        product.category.toLowerCase().includes(termo);
      if (!correspondeTermo) return false;
    }

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
    <div className={styles.buscaContainer}>
      <Header navigate={navigate} currentRoute="busca" />

      <main className={styles.buscaMain}>
        <div className={styles.buscaLayout}>

          <div className={styles.buscaContentMain}>
            <div className={styles.buscaControlsContainer}>
              <div className={styles.orderButtonContainer}>
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
                className={styles.mobileFilterTriggerBtn}
                onClick={() => setIsFilterMobileOpen(true)}
              >
                <span>Filtrar</span>
              </button>
            </div>

            <div className={styles.productsGrid}>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    title={product.title}
                    brand={product.locador}
                    price={product.price}
                    images={product.images}
                    imageVerificado={product.imageVerificado}
                    imageNota={product.imageNota}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    onNavigate={() => handleCardClick(product)}
                  />
                ))
              ) : (
                <p className={styles.noProductsMessage}>Nenhum produto encontrado com os filtros selecionados.</p>
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
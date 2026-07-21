import styles from './Home.module.css';
import type { Route } from '../../router/useRouter';
import { useProdutoStore } from "../../hooks/useProdutoStore";

// Components
import Header from '../../components/Header/Header';
import { Banner } from '../../components/Banner/Banner';
import { CategoryFilter } from '../../components/CategoryFilter/CategoryFilter';
import { ProductCard } from '../../components/ProductCard/ProductCard';

// Dados mockados
import { MOCK_PRODUCTS } from './Home.mock';
import { PRODUTOS_MOCK } from '../../mocks/produtos.mock';
import { toProdutoSelecionado } from '../../mocks/produtos.adapters';
import type { ProdutoHome } from './Home.types';

interface HomeProps {
  navigate: (route: Route) => void;
}

export default function Home({ navigate }: HomeProps) {
  const { setProdutoSelecionado } = useProdutoStore();

  const handleCardClick = (product: ProdutoHome) => {
    // O card da Home só carrega um recorte do produto (ProdutoHome).
    // Buscamos o produto completo no catálogo central para levar pra frente
    // os dados reais do locador (nome, localização, categoria, estoque),
    // em vez de valores fixos/placeholder.
    const produtoCompleto = PRODUTOS_MOCK.find((p) => p.id === product.id);

    if (!produtoCompleto) return;

    setProdutoSelecionado(toProdutoSelecionado(produtoCompleto));

    navigate('produtoDetalhe');
  };

  return (
    <div className={styles.homeContainer}>
      <Header navigate={navigate} currentRoute="home" />

      <main className={styles.homeMain}>
        <Banner />
        <CategoryFilter />

        <div className={styles.productsGrid}>
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              brand={product.brand}
              price={product.price}
              images={product.images}
              imageVerificado={product.imageVerificado}
              imageNota={product.imageNota}
              rating={product.rating}
              reviewCount={product.reviewCount}
              onNavigate={() => handleCardClick(product)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
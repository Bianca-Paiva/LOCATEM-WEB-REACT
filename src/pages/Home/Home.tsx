import { useMemo } from 'react';
import styles from './Home.module.css';
import type { Route } from '../../router/useRouter';
import { useProdutoStore } from "../../hooks/useProdutoStore";
import { useCatalogoStore } from '../../hooks/useCatalogoStore';

// Components
import Header from '../../components/Header/Header';
import { Banner } from '../../components/Banner/Banner';
import { CategoryFilter } from '../../components/CategoryFilter/CategoryFilter';
import { ProductCard } from '../../components/ProductCard/ProductCard';

// Dados mockados
import { toProdutoHome, toProdutoSelecionado } from '../../mocks/produtos.adapters';
import type { ProdutoHome } from './Home.types';

interface HomeProps {
  navigate: (route: Route) => void;
}

export default function Home({ navigate }: HomeProps) {
  const { setProdutoSelecionado } = useProdutoStore();
  const { produtos } = useCatalogoStore();

  // Catálogo completo da Home: todos os produtos disponíveis + ferramentas
  // recém-publicadas pelo usuário, sempre em primeiro. Vem do CatalogoContext
  // (reativo), não mais de um recorte fixo de ids.
  const produtosHome = useMemo(
    () =>
      [...produtos]
        .sort((a, b) => (b.meuAnuncio ? 1 : 0) - (a.meuAnuncio ? 1 : 0))
        .map(toProdutoHome),
    [produtos],
  );

  const handleCardClick = (product: ProdutoHome) => {
    // O card da Home só carrega um recorte do produto (ProdutoHome).
    // Buscamos o produto completo no catálogo central para levar pra frente
    // os dados reais do locador (nome, localização, categoria, estoque),
    // em vez de valores fixos/placeholder.
    const produtoCompleto = produtos.find((p) => p.id === product.id);

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
          {produtosHome.map((product) => (
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
          ))}
        </div>
      </main>
    </div>
  );
}
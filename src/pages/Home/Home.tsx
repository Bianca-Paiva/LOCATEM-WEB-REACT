import { useMemo, useState } from 'react';
import styles from './Home.module.css';
import type { Route } from '../../router/useRouter';
import { useProdutoStore } from "../../hooks/useProdutoStore";
import { useCatalogoStore } from '../../hooks/useCatalogoStore';
import { derivarCategorias, extrairCategoriaTopo } from '../../utils/categorias';

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

  // Categorias derivadas do catálogo real (mesma fonte usada pelos filtros da Busca),
  // em vez de uma lista fixa que podia divergir das ferramentas realmente cadastradas.
  const categorias = useMemo(
    () => derivarCategorias(produtos).map((c) => c.categoria),
    [produtos],
  );

  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('');

  // Mantém uma categoria selecionada assim que o catálogo carrega, sem sobrescrever
  // uma escolha que o usuário já tenha feito.
  if (!categoriaAtiva && categorias.length > 0) {
    setCategoriaAtiva(categorias[0]);
  }

  // Catálogo completo da Home, filtrado pela categoria selecionada no CategoryFilter:
  // todos os produtos disponíveis dessa categoria + ferramentas recém-publicadas pelo
  // usuário, sempre em primeiro. Vem do CatalogoContext (reativo), não mais de um
  // recorte fixo de ids.
  const produtosHome = useMemo(
    () =>
      [...produtos]
        .filter((p) => !categoriaAtiva || extrairCategoriaTopo(p.categoria) === categoriaAtiva)
        .sort((a, b) => (b.meuAnuncio ? 1 : 0) - (a.meuAnuncio ? 1 : 0))
        .map(toProdutoHome),
    [produtos, categoriaAtiva],
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
        <CategoryFilter
          categorias={categorias}
          categoriaSelecionada={categoriaAtiva}
          onSelecionarCategoria={setCategoriaAtiva}
        />

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
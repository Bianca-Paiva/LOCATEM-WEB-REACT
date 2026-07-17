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
import type { ProdutoHome } from './Home.types';

interface HomeProps {
  navigate: (route: Route) => void;
}

export default function Home({ navigate }: HomeProps) {
  const { setProdutoSelecionado } = useProdutoStore();

  const handleCardClick = (product: ProdutoHome) => {
    setProdutoSelecionado({
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      images: product.images,
      imageVerificado: product.imageVerificado,
      imageNota: product.imageNota,
      rating: product.rating,
      reviewCount: product.reviewCount,
      locador: 'Nome do Locador Exemplo',
      localizacao: 'São Paulo - SP',
      categoria: 'Categoria Genérica',
      estoqueDisponivel: 1,
    });

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
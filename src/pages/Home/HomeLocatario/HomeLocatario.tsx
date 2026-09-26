import { useEffect, useMemo, useState } from 'react';
import { Drill } from 'lucide-react';

import type { ProdutoHome } from './HomeLocatario.types';
import styles from './HomeLocatario.module.css';
import type { Route } from '../../../router/useRouter';

import type { ProdutoSelecionado } from '../../../context/Ferramentas/Produto/ProdutoContext';
import { useProdutoStore } from '../../../hooks/Ferramentas/useProdutoStore';
import {
  buscarFerramentasDisponiveis,
  type FerramentaDisponivel,
} from '../../../services/ferramentaservice';
import {
  ferramentaParaProdutoHome,
  ferramentaParaProdutoSelecionado,
} from '../../../services/ferramentaAdapters';

import Header from '../../../components/Layout/Header/Header';
import { Banner } from '../../../components/Shared/Banner/Banner';
import { CategoryFilter } from '../../../components/Busca/CategoryFilter/CategoryFilter';
import { ProductCard } from '../../../components/Ferramentas/ProductCard/ProductCard';


interface HomeProps {
  navigate: (route: Route) => void;
}

function categoriaDaFerramenta(ferramenta: FerramentaDisponivel): string {
  return ferramenta.categoriaNome || `Categoria ${ferramenta.categoriaId}`;
}

export default function Home({ navigate }: HomeProps) {
  const { setProdutoSelecionado } = useProdutoStore();
  const [ferramentas, setFerramentas] = useState<FerramentaDisponivel[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState('');

  useEffect(() => {
    const carregarVitrine = async () => {
      try {
        setFerramentas(await buscarFerramentasDisponiveis());
      } catch (error) {
        console.error('Erro ao carregar ferramentas da vitrine:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarVitrine();
  }, []);

  const categorias = useMemo(
    () => Array.from(new Set(ferramentas.map(categoriaDaFerramenta))),
    [ferramentas],
  );

  const categoriaSelecionada = categorias.includes(categoriaAtiva)
    ? categoriaAtiva
    : (categorias[0] ?? '');

  const produtosHome = useMemo(
    () =>
      ferramentas
        .filter(
          (ferramenta) =>
            !categoriaSelecionada || categoriaDaFerramenta(ferramenta) === categoriaSelecionada,
        )
        .map(ferramentaParaProdutoHome),
    [ferramentas, categoriaSelecionada],
  );

  const handleCardClick = (produto: ProdutoHome) => {
    const ferramenta = ferramentas.find((item) => item.ferramentaId === produto.id);
    if (!ferramenta) return;

    const produtoSelecionado: ProdutoSelecionado = ferramentaParaProdutoSelecionado(ferramenta);

    setProdutoSelecionado(produtoSelecionado);
    navigate('produtoDetalhe');
  };

  return (
    <div className={styles.homeContainer}>
      <Header navigate={navigate} currentRoute="home" />

      <main className={styles.homeMain}>
        <Banner />

        {categorias.length > 0 && (
          <CategoryFilter
            categorias={categorias}
            categoriaSelecionada={categoriaSelecionada}
            onSelecionarCategoria={setCategoriaAtiva}
          />
        )}

        {carregando ? (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando vitrine...</p>
        ) : produtosHome.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#6b7280' }}>
            <Drill size={64} style={{ margin: '0 auto', marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151' }}>
              Nenhuma ferramenta na vitrine
            </h3>
            <p style={{ marginTop: '0.5rem' }}>
              Ainda não há ferramentas disponíveis para locação no momento.
            </p>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {produtosHome.map((produto) => (
              <ProductCard
                key={produto.id}
                title={produto.title}
                brand={produto.locador}
                price={produto.price}
                images={produto.images}
                imageVerificado={produto.imageVerificado}
                imageNota={produto.imageNota}
                rating={produto.rating}
                reviewCount={produto.reviewCount}
                productId={produto.id}
                showFavorite
                onNavigate={() => handleCardClick(produto)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

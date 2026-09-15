import { useEffect, useMemo, useState } from 'react';
import styles from './Home.module.css';
import type { Route } from '../../router/useRouter';
import { useProdutoStore } from "../../hooks/Produto/useProdutoStore";
import { buscarFerramentasDisponiveis } from '../../services/ferramentaservice';
import { Drill } from 'lucide-react';

// Components
import Header from '../../components/Header/Header';
import { Banner } from '../../components/Banner/Banner';
import { CategoryFilter } from '../../components/CategoryFilter/CategoryFilter';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import type { ProdutoHome } from './Home.types';

interface HomeProps {
  navigate: (route: Route) => void;
}

export default function Home({ navigate }: HomeProps) {
  const { setProdutoSelecionado } = useProdutoStore();
  
  // Estados para gerenciar os dados reais da API
  const [ferramentasRaw, setFerramentasRaw] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('');

  // 1. Busca os dados reais do Backend assim que a tela abre
  useEffect(() => {
    const carregarVitrine = async () => {
      try {
        const dados = await buscarFerramentasDisponiveis();
        setFerramentasRaw(dados);
      } catch (error) {
        console.error("Erro ao carregar ferramentas da vitrine:", error);
      } finally {
        setCarregando(false);
      }
    };

    carregarVitrine();
  }, []);

  // 2. Extrai categorias dinâmicas (usando o ID ou nome que vier do banco)
  const categorias = useMemo(() => {
    // Como a API atual pode não trazer o nome da categoria populado (sem o .Include),
    // agrupamos pelo CategoriaId temporariamente ou usamos um fallback.
    const cats = ferramentasRaw.map(f => f.categoria?.nome || `Categoria ${f.categoriaId || 1}`);
    return Array.from(new Set(cats));
  }, [ferramentasRaw]);

  if (!categoriaAtiva && categorias.length > 0) {
    setCategoriaAtiva(categorias[0]);
  }

  // 3. Converte os dados do C# para o formato do seu ProductCard (ProdutoHome)
  const produtosHome = useMemo<ProdutoHome[]>(() => {
    return ferramentasRaw
      .filter(f => {
        const cat = f.categoria?.nome || `Categoria ${f.categoriaId || 1}`;
        return !categoriaAtiva || cat === categoriaAtiva;
      })
      .map(f => ({
        id: f.ferramentaId,
        title: f.nome,
        marca: f.marca || 'Sem Marca',
        locador: f.usuario?.nome || 'Locador Parceiro',
        price: f.diaria ? f.diaria.toFixed(2).replace('.', ',') : '0,00',
        images: ['/caminho-padrao-ou-foto-real.jpg'], // O ideal é usar f.ferramentaImagens se existir
        imageVerificado: '/icon-verified.png', // Fallbacks visuais
        imageNota: '/icon-star.png',
        rating: 5.0, // Avaliação fixa até o backend calcular a média
        reviewCount: 0
      }));
  }, [ferramentasRaw, categoriaAtiva]);

  const handleCardClick = (product: ProdutoHome) => {
    // Achamos o objeto original que veio do banco de dados
    const produtoCompleto = ferramentasRaw.find((p) => p.ferramentaId === product.id);
    if (!produtoCompleto) return;

    // Joga pro contexto global para a tela de Detalhes usar
    setProdutoSelecionado({
      ...produtoCompleto,
      priceFormatado: product.price // Enviamos um facilitador pro Detalhe
    });

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
            categoriaSelecionada={categoriaAtiva}
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
            {produtosHome.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                brand={product.locador}
                price={`R$ ${product.price}/dia`}
                images={product.images}
                imageVerificado={product.imageVerificado}
                imageNota={product.imageNota}
                rating={product.rating}
                reviewCount={product.reviewCount}
                onNavigate={() => handleCardClick(product)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
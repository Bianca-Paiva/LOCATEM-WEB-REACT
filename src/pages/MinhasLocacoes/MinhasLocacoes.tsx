import { useMemo } from 'react';
import { Icon } from '@iconify/react';

import Header from '../../components/Header/Header';
import CabecalhoPagina from '../../components/CabecalhoPagina/CabecalhoPagina';
import EstadoVazio from '../../components/MinhasReservas/EstadoVazio/EstadoVazio';
import { ProductCard } from '../../components/ProductCard/ProductCard';

import { useCatalogoStore } from '../../hooks/useCatalogoStore';
import { useProdutoStore } from '../../hooks/useProdutoStore';
import { toProdutoHome, toProdutoSelecionado } from '../../mocks/produtos.adapters';
import styles from './MinhasLocacoes.module.css';

import type { Route } from '../../router/useRouter';

interface MinhasLocacoesProps {
  navigate: (route: Route) => void;
}

export default function MinhasLocacoes({ navigate }: MinhasLocacoesProps) {
  const { produtos } = useCatalogoStore();
  const { setProdutoSelecionado } = useProdutoStore();

  // Só as ferramentas publicadas pelo usuário atual (fluxo de Cadastro de Ferramenta)
  const minhasFerramentas = useMemo(
    () => produtos.filter((p) => p.meuAnuncio).map(toProdutoHome),
    [produtos],
  );

  const handleCardClick = (produtoId: number) => {
    const produtoCompleto = produtos.find((p) => p.id === produtoId);
    if (!produtoCompleto) return;
    setProdutoSelecionado(toProdutoSelecionado(produtoCompleto));
    navigate('produtoDetalhe');
  };

  const botaoNovaFerramenta = (
    <button
      type="button"
      className={styles.botaoNovaFerramenta}
      onClick={() => navigate('cadastroFerramenta')}
    >
      <Icon icon="mdi:plus" width={18} height={18} />
      Cadastrar Ferramenta
    </button>
  );

  return (
    <>
      <Header navigate={navigate} currentRoute="minhasLocacoes" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo="Minhas Locações"
          subtitulo="Gerencie as ferramentas que você anuncia para locação."
          acao={botaoNovaFerramenta}
        />

        {minhasFerramentas.length === 0 ? (
          <EstadoVazio
            titulo="Você ainda não anunciou nenhuma ferramenta"
            descricao='Clique em "Cadastrar Ferramenta" para publicar seu primeiro anúncio.'
          />
        ) : (
          <div className={styles.grade}>
            {minhasFerramentas.map((produto) => (
              <ProductCard
                key={produto.id}
                title={produto.title}
                brand={produto.brand}
                price={produto.price}
                images={produto.images}
                imageVerificado={produto.imageVerificado}
                imageNota={produto.imageNota}
                rating={produto.rating}
                reviewCount={produto.reviewCount}
                onNavigate={() => handleCardClick(produto.id)}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

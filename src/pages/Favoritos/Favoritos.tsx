import { useMemo, useState } from 'react';
import { Heart, PackageOpen } from 'lucide-react';

import Header from '../../components/Layout/Header/Header';
import CabecalhoPagina from '../../components/Layout/CabecalhoPagina/CabecalhoPagina';
import Abas from '../../components/Ferramentas/MinhasFerramentas/Abas/Abas';
import type { AbaItem } from '../../components/Ferramentas/MinhasFerramentas/Abas/Abas';
import { ProductCard } from '../../components/Ferramentas/ProductCard/ProductCard';
import StatusFerramentaBadge from '../../components/Ferramentas/MinhasFerramentas/StatusFerramentaBadge/StatusFerramentaBadge';

import { useFavoritos } from '../../hooks/Conta/Favoritos/useFavoritos';
import { useProdutoStore } from '../../hooks/Ferramentas/useProdutoStore';
import { useAuth } from '../../hooks/Auth/useAuth';
import { ferramentaParaProdutoSelecionado } from '../../services/ferramentaAdapters';
import { normalizarUrlImagem } from '../../services/ferramentaservice';
import type { Route } from '../../router/useRouter';
import styles from './Favoritos.module.css';
import type { StatusFerramenta } from '../../types/Ferramentas/produto.types';
import FormSelect from '../../components/Shared/Inputs/FormSelect/FormSelect';

type FiltroFavorito = 'todas' | 'disponiveis' | 'indisponiveis';
type Ordenacao = 'recentes' | 'menorPreco' | 'maiorPreco' | 'melhorAvaliacao';

interface FavoritosProps {
  navigate: (route: Route) => void;
}

function obterStatus(status: number, disponibilidade: number, quantidade: number): StatusFerramenta {
  if (status === 1 && disponibilidade === 1 && quantidade > 0) {
    return 'disponivel';
  }

  return 'indisponivel';
}

export default function Favoritos({ navigate }: FavoritosProps) {
  const { usuario } = useAuth();
  const { favoritos, carregando, erro } = useFavoritos();
  const { setProdutoSelecionado } = useProdutoStore();

  const [filtro, setFiltro] = useState<FiltroFavorito>('todas');
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('recentes');

  const contagens = useMemo(() => {
    const contagem: Record<FiltroFavorito, number> = {
      todas: favoritos.length,
      disponiveis: 0,
      indisponiveis: 0,
    };

    favoritos.forEach(({ ferramenta }) => {
      const status = obterStatus(
        ferramenta.status,
        ferramenta.disponibilidade,
        ferramenta.quantidadeDisponivel,
      );

      if (status === 'disponivel') {
        contagem.disponiveis += 1;
      } else {
        contagem.indisponiveis += 1;
      }
    });

    return contagem;
  }, [favoritos]);

  const favoritosFiltrados = useMemo(() => {
    const filtrados = favoritos.filter(({ ferramenta }) => {
      const status = obterStatus(
        ferramenta.status,
        ferramenta.disponibilidade,
        ferramenta.quantidadeDisponivel,
      );

      if (filtro === 'disponiveis') return status === 'disponivel';
      if (filtro === 'indisponiveis') return status === 'indisponivel';

      return true;
    });

    return [...filtrados].sort((a, b) => {
      switch (ordenacao) {
        case 'menorPreco':
          return a.ferramenta.diaria - b.ferramenta.diaria;
        case 'maiorPreco':
          return b.ferramenta.diaria - a.ferramenta.diaria;
        case 'melhorAvaliacao':
          return b.ferramenta.avaliacaoMedia - a.ferramenta.avaliacaoMedia;
        default:
          return new Date(b.dataFavorito).getTime() - new Date(a.dataFavorito).getTime();
      }
    });
  }, [favoritos, filtro, ordenacao]);

  const abas: AbaItem<FiltroFavorito>[] = [
    { key: 'todas', label: 'Todas' },
    { key: 'disponiveis', label: 'Disponíveis' },
    { key: 'indisponiveis', label: 'Indisponíveis' },
  ];

  const handleVerDetalhes = (ferramentaId: number) => {
    const favorito = favoritos.find((item) => item.ferramentaId === ferramentaId);

    if (!favorito) return;

    setProdutoSelecionado(ferramentaParaProdutoSelecionado(favorito.ferramenta));
    navigate('produtoDetalhe');
  };

  const ordenacaoControl = (
    <div className={styles.ordenacao}>
      <span>Ordenar por</span>
      <FormSelect
        className={styles.selectOrdenacao}
        value={ordenacao}
        onChange={(value) => setOrdenacao(value as Ordenacao)}
        options={[
          { value: 'recentes', label: 'Mais recentes' },
          { value: 'menorPreco', label: 'Menor preço' },
          { value: 'maiorPreco', label: 'Maior preço' },
          { value: 'melhorAvaliacao', label: 'Melhor avaliação' },
        ]}
      />
    </div>
  );
  if (!usuario) {
    return (
      <>
        <Header navigate={navigate} currentRoute="favoritos" />
        <main className={styles.pagina}>
          <section className={styles.estadoLista}>
            <Heart size={52} />
            <h2>Meus Favoritos</h2>
            <p>Entre na sua conta para visualizar as ferramentas salvas.</p>
            <button type="button" onClick={() => navigate('login')}>
              Entrar na conta
            </button>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Header navigate={navigate} currentRoute="favoritos" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo="Meus Favoritos"
          subtitulo="Aqui estão as ferramentas que você salvou para alugar depois."
          acao={ordenacaoControl}
        />

        <Abas abas={abas} ativo={filtro} onChange={setFiltro} contagem={contagens} />

        {carregando ? (
          <section className={styles.estadoLista}>
            <p>Carregando seus favoritos...</p>
          </section>
        ) : erro ? (
          <section className={styles.estadoLista}>
            <h2>Não foi possível carregar seus favoritos</h2>
            <p>{erro}</p>
          </section>
        ) : favoritosFiltrados.length === 0 ? (
          <section className={styles.estadoLista}>
            <PackageOpen size={48} />
            <h2>
              {favoritos.length === 0
                ? 'Você ainda não favoritou nenhuma ferramenta'
                : 'Nenhuma ferramenta encontrada neste filtro'}
            </h2>
            <p>
              {favoritos.length === 0
                ? 'Clique no coração de uma ferramenta para salvá-la aqui.'
                : 'Altere a aba para visualizar os outros favoritos.'}
            </p>
          </section>
        ) : (
          <section className={styles.grade}>
            {favoritosFiltrados.map(({ ferramenta }) => {
              const status = obterStatus(
                ferramenta.status,
                ferramenta.disponibilidade,
                ferramenta.quantidadeDisponivel,
              );

              return (
                <ProductCard
                  key={ferramenta.ferramentaId}
                  productId={ferramenta.ferramentaId}
                  title={ferramenta.nome}
                  brand={ferramenta.usuarioNome}
                  price={Number(ferramenta.diaria ?? 0).toFixed(2).replace('.', ',')}
                  images={ferramenta.fotos
                    .map((foto) => normalizarUrlImagem(foto.urlImagem))
                    .filter(Boolean)}
                  rating={Number(ferramenta.avaliacaoMedia ?? 0)}
                  reviewCount={ferramenta.totalAvaliacoes ?? 0}
                  showFavorite
                  statusBadge={<StatusFerramentaBadge status={status} compacto />}
                  onNavigate={() => handleVerDetalhes(ferramenta.ferramentaId)}
                />
              );
            })}
          </section>
        )}
      </main>
    </>
  );
}

import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { Eye, Pencil } from 'lucide-react';

import Header from '../../components/Header/Header';
import CabecalhoPagina from '../../components/CabecalhoPagina/CabecalhoPagina';
import EstadoVazio from '../../components/MinhasLocacoes/EstadoVazio/EstadoVazio';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import Abas from '../../components/MinhasFerramentas/Abas/Abas';
import type { AbaItem } from '../../components/MinhasFerramentas/Abas/Abas';
import StatusFerramentaBadge from '../../components/MinhasFerramentas/StatusFerramentaBadge/StatusFerramentaBadge';
import { STATUS_FERRAMENTA_CONFIG } from '../../components/MinhasFerramentas/StatusFerramentaBadge/statusFerramentaConfig';

import { useCatalogoStore } from '../../hooks/Catalago/useCatalogoStore';
import { useAuth } from '../../hooks/Auth/useAuth';
import { toProdutoHome } from '../../mocks/produtos.adapters';
import styles from './MinhasFerramentas.module.css';

import type { Route } from '../../router/useRouter';
import type { StatusFerramenta } from '../../types/Produto/produto.types';

interface MinhasFerramentasProps {
  navigate: (route: Route) => void;
}

/** Aba selecionada no filtro de ferramentas ("todas" + cada status) */
type FiltroFerramenta = 'todas' | StatusFerramenta;

const ESTADO_VAZIO_TEXTO: Record<FiltroFerramenta, { titulo: string; descricao: string }> = {
  todas: {
    titulo: 'Você ainda não anunciou nenhuma ferramenta',
    descricao: 'Clique em "Cadastrar Ferramenta" para publicar seu primeiro anúncio.',
  },
  disponivel: {
    titulo: 'Nenhuma ferramenta disponível',
    descricao: 'Ferramentas com o status "Disponível" aparecerão aqui.',
  },
  locada: {
    titulo: 'Nenhuma ferramenta locada no momento',
    descricao: 'Ferramentas em locação no momento aparecerão aqui.',
  },
  indisponivel: {
    titulo: 'Nenhuma ferramenta indisponível',
    descricao: 'Ferramentas pausadas ou marcadas como indisponíveis aparecerão aqui.',
  },
  manutencao: {
    titulo: 'Nenhuma ferramenta em manutenção',
    descricao: 'Ferramentas em manutenção aparecerão aqui.',
  },
};

export default function MinhasFerramentas({ navigate }: MinhasFerramentasProps) {
  const { produtos, setFerramentaSelecionadaId } = useCatalogoStore();
  const { usuario } = useAuth();
  const [filtro, setFiltro] = useState<FiltroFerramenta>('todas');

  // Só as ferramentas do locador atualmente logado — nunca pelo texto exibido na tela, sempre pelo identificador único do locador (Usuario.locadorId <-> Produto.locadorId).
  const minhasFerramentasCompletas = useMemo(
    () => produtos.filter((p) => p.locadorId && p.locadorId === usuario?.locadorId),
    [produtos, usuario],
  );

  const contagem = useMemo(() => {
    const base: Record<FiltroFerramenta, number> = {
      todas: minhasFerramentasCompletas.length,
      disponivel: 0,
      locada: 0,
      indisponivel: 0,
      manutencao: 0,
    };

    minhasFerramentasCompletas.forEach((produto) => {
      base[produto.status] += 1;
    });

    return base;
  }, [minhasFerramentasCompletas]);

  const ferramentasFiltradas = useMemo(() => {
    const lista =
      filtro === 'todas'
        ? minhasFerramentasCompletas
        : minhasFerramentasCompletas.filter((p) => p.status === filtro);

    return lista.map(toProdutoHome);
  }, [minhasFerramentasCompletas, filtro]);

  const abas: AbaItem<FiltroFerramenta>[] = [
    { key: 'todas', label: 'Todas' },
    { key: 'disponivel', label: STATUS_FERRAMENTA_CONFIG.disponivel.tabLabel },
    { key: 'locada', label: STATUS_FERRAMENTA_CONFIG.locada.tabLabel },
    { key: 'indisponivel', label: STATUS_FERRAMENTA_CONFIG.indisponivel.tabLabel },
    { key: 'manutencao', label: STATUS_FERRAMENTA_CONFIG.manutencao.tabLabel },
  ];

  const handleVer = (produtoId: number) => {
    setFerramentaSelecionadaId(produtoId);
    navigate('ferramentaDetalhe');
  };

  const handleEditar = (produtoId: number) => {
    setFerramentaSelecionadaId(produtoId);
    navigate('cadastroFerramenta');
  };

  const botaoNovaFerramenta = (
    <button
      type="button"
      className={styles.botaoNovaFerramenta}
      onClick={() => {
        setFerramentaSelecionadaId(null);
        navigate('cadastroFerramenta');
      }}
    >
      <Icon icon="mdi:plus" width={18} height={18} />
      Cadastrar Ferramenta
    </button>
  );

  const estadoVazio = ESTADO_VAZIO_TEXTO[filtro];

  return (
    <>
      <Header navigate={navigate} currentRoute="minhasFerramentas" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo="Minhas Ferramentas"
          subtitulo="Gerencie as ferramentas que você anuncia para locação."
          acao={botaoNovaFerramenta}
        />

        <Abas abas={abas} ativo={filtro} onChange={setFiltro} contagem={contagem} />

        {ferramentasFiltradas.length === 0 ? (
          <EstadoVazio titulo={estadoVazio.titulo} descricao={estadoVazio.descricao} />
        ) : (
          <div className={styles.grade}>
            {ferramentasFiltradas.map((produto) => {
              const produtoCompleto = minhasFerramentasCompletas.find((p) => p.id === produto.id);
              if (!produtoCompleto) return null;

              return (
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
                  statusBadge={<StatusFerramentaBadge status={produtoCompleto.status} compacto />}
                  footerExtra={
                    <div className={styles.acoesCard}>
                      <button
                        type="button"
                        className={styles.botaoAcao}
                        onClick={() => handleVer(produtoCompleto.id)}
                      >
                        <Eye size={14} strokeWidth={2} />
                        Ver
                      </button>
                      <button
                        type="button"
                        className={styles.botaoAcao}
                        onClick={() => handleEditar(produtoCompleto.id)}
                      >
                        <Pencil size={14} strokeWidth={2} />
                        Editar
                      </button>
                    </div>
                  }
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

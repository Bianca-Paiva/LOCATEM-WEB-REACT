/**
 * Área do locador para acompanhar ferramentas cadastradas.
 * Lista anúncios, filtra por status e abre fluxos de detalhe/edição/remoção.
 */
import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { Eye, Pencil } from 'lucide-react';

import Header from '../../../components/Layout/Header/Header';
import CabecalhoPagina from '../../../components/Layout/CabecalhoPagina/CabecalhoPagina';
import EstadoVazio from '../../../components/Locacoes/MinhasLocacoes/EstadoVazio/EstadoVazio';
import { ProductCard } from '../../../components/Ferramentas/ProductCard/ProductCard';
import Abas from '../../../components/Ferramentas/MinhasFerramentas/Abas/Abas';
import type { AbaItem } from '../../../components/Ferramentas/MinhasFerramentas/Abas/Abas';
import StatusFerramentaBadge from '../../../components/Ferramentas/MinhasFerramentas/StatusFerramentaBadge/StatusFerramentaBadge';
import { STATUS_FERRAMENTA_CONFIG } from '../../../components/Ferramentas/MinhasFerramentas/StatusFerramentaBadge/statusFerramentaConfig';

import { useCatalogoStore } from '../../../hooks/Ferramentas/useCatalogoStore';
import { useProdutoStore } from '../../../hooks/Ferramentas/useProdutoStore';
import { useAuth } from '../../../hooks/Auth/useAuth';
import { buscarMinhasFerramentas, type FerramentaDisponivel } from '../../../services/ferramentaservice';
import { ferramentaParaProdutoHome, ferramentaParaProdutoSelecionado } from '../../../services/ferramentaAdapters';
import styles from './MinhasFerramentas.module.css';

import type { Route } from '../../../router/useRouter';
import type { StatusFerramenta } from '../../../types/Ferramentas/produto.types';

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
  const { setFerramentaSelecionadaId } = useCatalogoStore();
  const { setProdutoSelecionado } = useProdutoStore();
  const { usuario } = useAuth();
  const [filtro, setFiltro] = useState<FiltroFerramenta>('todas');
  const [minhasFerramentasCompletas, setMinhasFerramentasCompletas] = useState<FerramentaDisponivel[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarMinhasFerramentas() {
      if (!usuario?.id || (usuario.tipo !== 'locador' && usuario.tipo !== 'administrador')) {
        if (ativo) {
          setMinhasFerramentasCompletas([]);
          setCarregando(false);
        }
        return;
      }

      setCarregando(true);
      setErro('');

      try {
        const ferramentas = await buscarMinhasFerramentas();
        if (ativo) {
          setMinhasFerramentasCompletas(ferramentas);
        }
      } catch (error) {
        if (ativo) {
          setMinhasFerramentasCompletas([]);
          setErro(error instanceof Error ? error.message : 'Não foi possível carregar suas ferramentas.');
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarMinhasFerramentas();

    return () => {
      ativo = false;
    };
  }, [usuario?.id, usuario?.tipo]);

  const obterStatus = (ferramenta: FerramentaDisponivel): StatusFerramenta => {
    if (ferramenta.disponibilidade === 4) return 'manutencao';
    if (ferramenta.disponibilidade === 2) return 'locada';
    if (ferramenta.status !== 1 || ferramenta.disponibilidade === 3) return 'indisponivel';
    return 'disponivel';
  };

  const contagem = useMemo(() => {
    const base: Record<FiltroFerramenta, number> = {
      todas: minhasFerramentasCompletas.length,
      disponivel: 0,
      locada: 0,
      indisponivel: 0,
      manutencao: 0,
    };

    minhasFerramentasCompletas.forEach((ferramenta) => {
      base[obterStatus(ferramenta)] += 1;
    });

    return base;
  }, [minhasFerramentasCompletas]);

  const ferramentasFiltradas = useMemo(() => {
    const lista =
      filtro === 'todas'
        ? minhasFerramentasCompletas
        : minhasFerramentasCompletas.filter((ferramenta) => obterStatus(ferramenta) === filtro);

    return lista.map((ferramenta) => ({
      raw: ferramenta,
      produto: ferramentaParaProdutoHome(ferramenta),
      status: obterStatus(ferramenta),
    }));
  }, [minhasFerramentasCompletas, filtro]);

  const abas: AbaItem<FiltroFerramenta>[] = [
    { key: 'todas', label: 'Todas' },
    { key: 'disponivel', label: STATUS_FERRAMENTA_CONFIG.disponivel.tabLabel },
    { key: 'locada', label: STATUS_FERRAMENTA_CONFIG.locada.tabLabel },
    { key: 'indisponivel', label: STATUS_FERRAMENTA_CONFIG.indisponivel.tabLabel },
    { key: 'manutencao', label: STATUS_FERRAMENTA_CONFIG.manutencao.tabLabel },
  ];

  const handleVer = (produtoId: number) => {
    const ferramenta = minhasFerramentasCompletas.find((item) => item.ferramentaId === produtoId);

    if (!ferramenta) return;

    setProdutoSelecionado(ferramentaParaProdutoSelecionado(ferramenta));
    setFerramentaSelecionadaId(null);
    navigate('produtoDetalhe');
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

        {carregando ? (
          <EstadoVazio
            titulo="Carregando suas ferramentas..."
            descricao="Buscando no backend os anúncios cadastrados pela sua conta."
          />
        ) : erro ? (
          <EstadoVazio
            titulo="Não foi possível carregar suas ferramentas"
            descricao={erro}
          />
        ) : ferramentasFiltradas.length === 0 ? (
          <EstadoVazio titulo={estadoVazio.titulo} descricao={estadoVazio.descricao} />
        ) : (
          <div className={styles.grade}>
            {ferramentasFiltradas.map(({ raw, produto, status }) => (
              <ProductCard
                key={raw.ferramentaId}
                title={produto.title}
                brand={produto.locador}
                price={produto.price}
                images={produto.images}
                imageVerificado={produto.imageVerificado}
                imageNota={produto.imageNota}
                rating={produto.rating}
                reviewCount={produto.reviewCount}
                statusBadge={<StatusFerramentaBadge status={status} compacto />}
                footerExtra={
                  <div className={styles.acoesCard}>
                    <button
                      type="button"
                      className={styles.botaoAcao}
                      onClick={() => handleVer(raw.ferramentaId)}
                    >
                      <Eye size={14} strokeWidth={2} />
                      Ver
                    </button>
                    <button
                      type="button"
                      className={styles.botaoAcao}
                      onClick={() => handleEditar(raw.ferramentaId)}
                    >
                      <Pencil size={14} strokeWidth={2} />
                      Editar
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

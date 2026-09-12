import { useEffect, useMemo, useState } from 'react';

import Header from '../../../components/Header/Header';
import CabecalhoPagina from '../../../components/CabecalhoPagina/CabecalhoPagina';
import EstadoVazio from '../../../components/MinhasLocacoes/EstadoVazio/EstadoVazio';
import Abas from '../../../components/MinhasFerramentas/Abas/Abas';
import type { AbaItem } from '../../../components/MinhasFerramentas/Abas/Abas';
import LocacaoHistoricoCard from '../../../components/MinhasFerramentas/HistoricosLocacoes/LocacaoHistoricoCard/LocacaoHistoricoCard';

import { useAuth } from '../../../hooks/Auth/useAuth';
import { useLocacaoStore } from '../../../hooks/Locacoes/useLocacaoStore';
import styles from './HistoricoLocacoes.module.css';

import type { Route } from '../../../router/useRouter';

type FiltroHistorico = 'todas' | 'finalizada' | 'recusada' | 'cancelada';

interface HistoricoLocacoesProps {
  navigate: (route: Route) => void;
}

export default function HistoricoLocacoes({ navigate }: HistoricoLocacoesProps) {
  const { usuario } = useAuth();
  const { locacoes } = useLocacaoStore();
  const [filtro, setFiltro] = useState<FiltroHistorico>('todas');
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!usuario || usuario.tipo !== 'locador') {
      navigate('home');
    }
  }, [usuario, navigate]);

  // Só o histórico das ferramentas do locador logado, e só locações já encerradas (finalizada, recusada ou cancelada) — locações em andamento ficam em Gerenciar Locações.
  const historicoCompleto = useMemo(
    () =>
      locacoes.filter(
        (l) =>
          l.locadorId &&
          l.locadorId === usuario?.locadorId &&
          (l.status === 'finalizada' || l.status === 'recusada' || l.status === 'cancelada'),
      ),
    [locacoes, usuario],
  );

  const contagem = useMemo(() => {
    const base: Record<FiltroHistorico, number> = {
      todas: historicoCompleto.length,
      finalizada: 0,
      recusada: 0,
      cancelada: 0,
    };
    historicoCompleto.forEach((l) => {
      base[l.status as 'finalizada' | 'recusada' | 'cancelada'] += 1;
    });
    return base;
  }, [historicoCompleto]);

  const historicoFiltrado = useMemo(
    () => (filtro === 'todas' ? historicoCompleto : historicoCompleto.filter((l) => l.status === filtro)),
    [historicoCompleto, filtro],
  );

  if (!usuario || usuario.tipo !== 'locador') {
    return null;
  }

  const abas: AbaItem<FiltroHistorico>[] = [
    { key: 'todas', label: 'Todas' },
    { key: 'finalizada', label: 'Finalizadas' },
    { key: 'recusada', label: 'Recusadas' },
    { key: 'cancelada', label: 'Canceladas' },
  ];

  // Alterna o card expandido/recolhido (múltiplos cards podem ficar abertos ao mesmo tempo)
  const alternarExpansao = (id: string) => {
    setExpandidos((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(id)) {
        proximo.delete(id);
      } else {
        proximo.add(id);
      }
      return proximo;
    });
  };

  return (
    <>
      <Header navigate={navigate} currentRoute="historicoLocacoes" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo="Histórico de Locações"
          subtitulo="Acompanhe todas as locações encerradas das suas ferramentas."
        />

        <Abas abas={abas} ativo={filtro} onChange={setFiltro} contagem={contagem} />

        {historicoFiltrado.length === 0 ? (
          <EstadoVazio
            titulo="Nenhuma locação no histórico"
            descricao="Locações finalizadas, recusadas ou canceladas aparecerão aqui."
          />
        ) : (
          <div className={styles.lista}>
            {historicoFiltrado.map((locacao) => (
              <LocacaoHistoricoCard
                key={locacao.id}
                locacao={locacao}
                expandido={expandidos.has(locacao.id)}
                onToggle={alternarExpansao}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
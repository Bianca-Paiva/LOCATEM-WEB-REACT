import { useEffect, useMemo, useState } from 'react';

import Header from '../../../components/Header/Header';
import CabecalhoPagina from '../../../components/CabecalhoPagina/CabecalhoPagina';
import EstadoVazio from '../../../components/MinhasLocacoes/EstadoVazio/EstadoVazio';
import Abas from '../../../components/MinhasFerramentas/Abas/Abas';
import type { AbaItem } from '../../../components/MinhasFerramentas/Abas/Abas';
import StatusBadge from '../../../components/MinhasLocacoes/EtiquetaStatus/EtiquetaStatus';

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

  useEffect(() => {
    if (!usuario || usuario.tipo !== 'locador') {
      navigate('home');
    }
  }, [usuario, navigate]);

  // Só o histórico das ferramentas do locador logado, e só locações já encerradas
  // (finalizada, recusada ou cancelada) — locações em andamento ficam em Gerenciar Locações.
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

  return (
    <>
      <Header navigate={navigate} currentRoute="historicoLocacoes" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo="Histórico de Locações"
          subtitulo="Todas as locações finalizadas, recusadas ou canceladas."
        />

        <Abas abas={abas} ativo={filtro} onChange={setFiltro} contagem={contagem} />

        {historicoFiltrado.length === 0 ? (
          <EstadoVazio
            titulo="Nenhuma locação no histórico"
            descricao="Locações finalizadas, recusadas ou canceladas aparecerão aqui."
          />
        ) : (
          <div className={styles.tabelaWrapper}>
            <div className={styles.tabela}>
              <div className={`${styles.linha} ${styles.linhaCabecalho}`}>
                <span>Ferramenta</span>
                <span>Locatário</span>
                <span>Período</span>
                <span>Status</span>
                <span className={styles.colunaValor}>Valor</span>
              </div>

              {historicoFiltrado.map((locacao) => (
                <div key={locacao.id} className={styles.linha}>
                  <span className={styles.celulaFerramenta} data-rotulo="Ferramenta">
                    {locacao.produto}
                  </span>
                  <span data-rotulo="Locatário">{locacao.locatario}</span>
                  <span data-rotulo="Período">{locacao.periodo}</span>
                  <span data-rotulo="Status">
                    <StatusBadge status={locacao.status} />
                  </span>
                  <span
                    className={`${styles.colunaValor} ${
                      locacao.status === 'finalizada' ? styles.valorPositivo : styles.valorNeutro
                    }`}
                    data-rotulo="Valor"
                  >
                    {locacao.status === 'finalizada' ? `+ ${locacao.valor}` : 'R$ 0,00'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

import { useMemo, useState } from 'react';
import { useLocacaoStore } from './useLocacaoStore';
import { useAuth } from '../Auth/useAuth';
import type { LocacaoData, StatusLocacao } from '../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';

/**
 * Filtro de "Gerenciar Locações" (visão do locador) — agrupa os status mais
 * granulares de `StatusLocacao` nas categorias exibidas no protótipo.
 */
export type FiltroGerenciarLocacao =
  | 'todas'
  | 'pendente'
  | 'aguardandoPagamento'
  | 'emTransporte'
  | 'emAndamento'
  | 'aguardandoDevolucao'
  | 'finalizada'
  | 'recusadaCancelada';

export const ABAS_GERENCIAR_LOCACAO: { key: FiltroGerenciarLocacao; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendente', label: 'Pendentes' },
  { key: 'aguardandoPagamento', label: 'Aguard. pagamento' },
  { key: 'emTransporte', label: 'Em transporte' },
  { key: 'emAndamento', label: 'Em andamento' },
  { key: 'aguardandoDevolucao', label: 'Aguard. devolução' },
  { key: 'finalizada', label: 'Finalizadas' },
  { key: 'recusadaCancelada', label: 'Recusadas/Canceladas' },
];

/** Agrupa um StatusLocacao granular na aba de Gerenciar Locações correspondente. */
function paraFiltro(status: StatusLocacao): Exclude<FiltroGerenciarLocacao, 'todas'> {
  switch (status) {
    case 'pendente':
      return 'pendente';
    case 'aguardandoPagamento':
      return 'aguardandoPagamento';
    case 'confirmada':
    case 'preparandoEntrega':
    case 'emTransporte':
    case 'devolucaoEmTransporte':
      return 'emTransporte';
    case 'emAndamento':
      return 'emAndamento';
    case 'aguardandoDevolucao':
      return 'aguardandoDevolucao';
    case 'finalizada':
      return 'finalizada';
    case 'recusada':
    case 'cancelada':
      return 'recusadaCancelada';
  }
}

export function useGerenciarLocacoes() {
  const { usuario } = useAuth();
  const { locacoes } = useLocacaoStore();
  const [filtro, setFiltro] = useState<FiltroGerenciarLocacao>('todas');

  // Só as locações das ferramentas do locador logado — sempre pelo identificador único do locador.
  const minhasLocacoes = useMemo(
    () => locacoes.filter((l) => l.locadorId && l.locadorId === usuario?.locadorId),
    [locacoes, usuario],
  );

  const contagem = useMemo(() => {
    const base: Record<FiltroGerenciarLocacao, number> = {
      todas: minhasLocacoes.length,
      pendente: 0,
      aguardandoPagamento: 0,
      emTransporte: 0,
      emAndamento: 0,
      aguardandoDevolucao: 0,
      finalizada: 0,
      recusadaCancelada: 0,
    };

    minhasLocacoes.forEach((locacao) => {
      base[paraFiltro(locacao.status)] += 1;
    });

    return base;
  }, [minhasLocacoes]);

  const locacoesFiltradas: LocacaoData[] = useMemo(() => {
    if (filtro === 'todas') return minhasLocacoes;
    return minhasLocacoes.filter((l) => paraFiltro(l.status) === filtro);
  }, [minhasLocacoes, filtro]);

  return { filtro, setFiltro, contagem, locacoesFiltradas };
}

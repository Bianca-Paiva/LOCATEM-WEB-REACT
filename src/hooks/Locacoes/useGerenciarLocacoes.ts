import { useMemo, useState } from 'react';
import { useLocacaoStore } from './useLocacaoStore';
import { useAuth } from '../Auth/useAuth';
import type { LocacaoData, StatusLocacao } from '../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';

/**
 * Filtro de "Gerenciar Locações" (visão do locador).
 *
 * Gerenciar Locações é a área operacional do locador: só existem aqui as locações ainda em aberto (ativas ou que dependem de alguma ação/acompanhamento dele). Locações finalizadas, recusadas ou canceladas saem desta tela e passam a aparecer apenas em Histórico de Locações — por isso esses status nem entram neste filtro.
 */
export type FiltroGerenciarLocacao =
  | 'emAberto'
  | 'pendente'
  | 'aguardandoPagamento'
  | 'preparandoEntrega'
  | 'emTransporte'
  | 'emAndamento'
  | 'aguardandoDevolucao'
  | 'devolucaoEmTransporte';

export const ABAS_GERENCIAR_LOCACAO: { key: FiltroGerenciarLocacao; label: string }[] = [
  { key: 'emAberto', label: 'Em aberto' },
  { key: 'pendente', label: 'Pendente' },
  { key: 'aguardandoPagamento', label: 'Aguardando pagamento' },
  { key: 'preparandoEntrega', label: 'Preparando entrega' },
  { key: 'emTransporte', label: 'Em transporte' },
  { key: 'emAndamento', label: 'Em andamento' },
  { key: 'aguardandoDevolucao', label: 'Aguardando devolução' },
  { key: 'devolucaoEmTransporte', label: 'Devolução em transporte' },
];

// Status que já se encerraram e por isso não pertencem mais a Gerenciar Locações (ficam disponíveis apenas em Histórico de Locações).
const STATUS_ENCERRADOS: StatusLocacao[] = ['finalizada', 'recusada', 'cancelada'];

/**
 * Agrupa um StatusLocacao granular na aba de Gerenciar Locações correspondente. `confirmada` (pagamento confirmado, aguardando o locador organizar o envio) entra na mesma aba de "Preparando entrega", já que ambos representam a etapa de preparação anterior ao transporte.
 */
function paraFiltro(status: StatusLocacao): Exclude<FiltroGerenciarLocacao, 'emAberto'> | null {
  switch (status) {
    case 'pendente':
      return 'pendente';
    case 'aguardandoPagamento':
      return 'aguardandoPagamento';
    case 'confirmada':
    case 'preparandoEntrega':
      return 'preparandoEntrega';
    case 'emTransporte':
      return 'emTransporte';
    case 'emAndamento':
      return 'emAndamento';
    case 'aguardandoDevolucao':
      return 'aguardandoDevolucao';
    case 'devolucaoEmTransporte':
      return 'devolucaoEmTransporte';
    case 'finalizada':
    case 'recusada':
    case 'cancelada':
      return null;
  }
}

export function useGerenciarLocacoes() {
  const { usuario } = useAuth();
  const { locacoes } = useLocacaoStore();
  const [filtro, setFiltro] = useState<FiltroGerenciarLocacao>('emAberto');

  // Só as locações das ferramentas do locador logado, e só as que ainda estão em aberto — locações encerradas (finalizada, recusada, cancelada) pertencem exclusivamente ao Histórico de Locações.
  const minhasLocacoesEmAberto = useMemo(
    () =>
      locacoes.filter(
        (l) => l.locadorId && l.locadorId === usuario?.locadorId && !STATUS_ENCERRADOS.includes(l.status),
      ),
    [locacoes, usuario],
  );

  const contagem = useMemo(() => {
    const base: Record<FiltroGerenciarLocacao, number> = {
      emAberto: minhasLocacoesEmAberto.length,
      pendente: 0,
      aguardandoPagamento: 0,
      preparandoEntrega: 0,
      emTransporte: 0,
      emAndamento: 0,
      aguardandoDevolucao: 0,
      devolucaoEmTransporte: 0,
    };

    minhasLocacoesEmAberto.forEach((locacao) => {
      const chave = paraFiltro(locacao.status);
      if (chave) base[chave] += 1;
    });

    return base;
  }, [minhasLocacoesEmAberto]);

  const locacoesFiltradas: LocacaoData[] = useMemo(() => {
    if (filtro === 'emAberto') return minhasLocacoesEmAberto;
    return minhasLocacoesEmAberto.filter((l) => paraFiltro(l.status) === filtro);
  }, [minhasLocacoesEmAberto, filtro]);

  return { filtro, setFiltro, contagem, locacoesFiltradas };
}
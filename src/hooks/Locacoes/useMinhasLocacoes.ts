import { useMemo, useState } from 'react';
import type { FiltroLocacao, StatusLocacao } from '../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import { useLocacaoStore } from './useLocacaoStore';

interface UseMinhasLocacoesReturn {
  locacoesFiltradas: ReturnType<typeof useLocacaoStore>['locacoes'];
  filtro: FiltroLocacao;
  setFiltro: (filtro: FiltroLocacao) => void;
  contagem: Record<FiltroLocacao, number>;
}

export function useMinhasLocacoes(): UseMinhasLocacoesReturn {
  // Locacoes vêm do contexto global, garantindo que alterações feitas em
  // DetalhesLocacao (ex: cancelamento) reflitam aqui também
  const { locacoes } = useLocacaoStore();
  const [filtro, setFiltro] = useState<FiltroLocacao>('todas');

  const contagem = useMemo(() => {
    const base: Record<FiltroLocacao, number> = {
      todas: locacoes.length,
      pendente: 0,
      aguardandoPagamento: 0,
      confirmada: 0,
      preparandoEntrega: 0,
      emTransporte: 0,
      emAndamento: 0,
      aguardandoDevolucao: 0,
      devolucaoEmTransporte: 0,
      finalizada: 0,
      recusada: 0,
      cancelada: 0,
    };

    locacoes.forEach((locacao) => {
      base[locacao.status] += 1;
    });

    return base;
  }, [locacoes]);

  const locacoesFiltradas = useMemo(() => {
    if (filtro === 'todas') return locacoes;
    return locacoes.filter((locacao) => locacao.status === (filtro as StatusLocacao));
  }, [locacoes, filtro]);

  return {
    locacoesFiltradas,
    filtro,
    setFiltro,
    contagem,
  };
}
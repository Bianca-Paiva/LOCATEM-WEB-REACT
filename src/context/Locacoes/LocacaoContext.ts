import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { LocacaoData } from '../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';

export interface LocacaoContextType {
  locacoes: LocacaoData[];
  locacaoSelecionada: LocacaoData | null;
  // Ajuste: Tipagem nativa do React para funções de atualização de estado
  setLocacaoSelecionada: Dispatch<SetStateAction<LocacaoData | null>>;
  atualizarLocacao: (id: string, dadosAtualizados: Partial<LocacaoData>) => void;
  adicionarLocacao: (dadosLocacao: Omit<LocacaoData, 'id'>) => LocacaoData;
}

export const LocacaoContext = createContext<LocacaoContextType | null>(null);

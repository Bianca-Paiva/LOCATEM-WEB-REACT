import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

interface BuscaContextType {
  /** Termo de busca atual, digitado na barra de pesquisa do Header em qualquer tela. */
  termoBusca: string;
  /** Atualiza o termo de busca global (usado pelo Header ao pesquisar). */
  setTermoBusca: (termo: string) => void;
}

export const BuscaContext = createContext<BuscaContextType | null>(null);

export function BuscaProvider({ children }: { children: ReactNode }) {
  // Fonte única do termo pesquisado — permite que a barra de busca do Header
  // funcione a partir de qualquer tela e que a página de Busca leia o termo
  // mais recente assim que for montada.
  const [termoBusca, setTermoBusca] = useState('');

  return (
    <BuscaContext.Provider value={{ termoBusca, setTermoBusca }}>
      {children}
    </BuscaContext.Provider>
  );
}

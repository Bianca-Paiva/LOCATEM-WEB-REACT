import { useState } from 'react';
import type { ReactNode } from 'react';
import { BuscaContext } from './BuscaContext';

export function BuscaProvider({ children }: { children: ReactNode }) {
  // Fonte única do termo pesquisado — permite que a barra de busca do Header funcione a partir de qualquer tela e que a página de Busca leia o termo mais recente assim que for montada.
  const [termoBusca, setTermoBusca] = useState('');

  return (
    <BuscaContext.Provider value={{ termoBusca, setTermoBusca }}>
      {children}
    </BuscaContext.Provider>
  );
}

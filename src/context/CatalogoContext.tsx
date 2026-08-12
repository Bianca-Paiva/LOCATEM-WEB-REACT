import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Produto } from '../types/produto.types';
import { PRODUTOS_MOCK } from '../mocks/produtos.mock';

interface CatalogoContextType {
  /** Fonte única de verdade do catálogo de ferramentas (mock inicial + novos anúncios). */
  produtos: Produto[];
  /** Cria uma ferramenta a partir dos dados do formulário de cadastro e a insere no topo do catálogo. */
  adicionarProduto: (dados: Omit<Produto, 'id' | 'meuAnuncio'>) => Produto;
}

export const CatalogoContext = createContext<CatalogoContextType | null>(null);

export function CatalogoProvider({ children }: { children: ReactNode }) {
  // Copia o catálogo mockado pra dentro do state — a partir daqui, o catálogo
  // central (produtos.mock.ts) continua sendo a fonte inicial, mas quem manda
  // no que é exibido nas telas passa a ser este state (reativo).
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_MOCK);

  const adicionarProduto: CatalogoContextType['adicionarProduto'] = (dados) => {
    const novoProduto: Produto = {
      ...dados,
      id: Date.now(),
      meuAnuncio: true,
    };

    setProdutos((atuais) => [novoProduto, ...atuais]);

    return novoProduto;
  };

  return (
    <CatalogoContext.Provider value={{ produtos, adicionarProduto }}>
      {children}
    </CatalogoContext.Provider>
  );
}

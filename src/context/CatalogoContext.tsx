import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Produto } from '../types/produto.types';
import type { AvaliacaoProduto } from '../pages/ProdutoDetalhe/ProdutoDetalhe.types';
import { PRODUTOS_MOCK } from '../mocks/produtos.mock';

interface CatalogoContextType {
  /** Fonte única de verdade do catálogo de ferramentas (mock inicial + novos anúncios). */
  produtos: Produto[];
  /** Cria uma ferramenta a partir dos dados do formulário de cadastro e a insere no topo do catálogo. */
  adicionarProduto: (dados: Omit<Produto, 'id' | 'meuAnuncio'>) => Produto;
  /**
   * Adiciona uma avaliação real ao produto (identificado pelo título, mesma convenção de correspondência por nome já usada para locadores — ver mocks/locadores.mock.ts). A partir daí, a média/quantidade de avaliações do produto (calculadas em utils/avaliacoesResumo.ts) já refletem essa avaliação automaticamente.
   */
  adicionarAvaliacaoProduto: (tituloProduto: string, avaliacao: AvaliacaoProduto) => void;
}

export const CatalogoContext = createContext<CatalogoContextType | null>(null);

export function CatalogoProvider({ children }: { children: ReactNode }) {
  // Copia o catálogo mockado pra dentro do state — a partir daqui, o catálogo central (produtos.mock.ts) continua sendo a fonte inicial, mas quem manda no que é exibido nas telas passa a ser este state (reativo).
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

  const adicionarAvaliacaoProduto: CatalogoContextType['adicionarAvaliacaoProduto'] = (tituloProduto, avaliacao) => {
    setProdutos((atuais) =>
      atuais.map((produto) =>
        produto.title === tituloProduto
          ? { ...produto, avaliacoes: [...(produto.avaliacoes ?? []), avaliacao] }
          : produto,
      ),
    );
  };

  return (
    <CatalogoContext.Provider value={{ produtos, adicionarProduto, adicionarAvaliacaoProduto }}>
      {children}
    </CatalogoContext.Provider>
  );
}
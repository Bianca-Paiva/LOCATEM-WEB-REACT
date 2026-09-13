import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Produto } from '../../../types/Ferramentas/produto.types';
import { PRODUTOS_MOCK } from '../../../mocks/produtos.mock';
import { CatalogoContext, type CatalogoContextType } from './CatalogoContext';

export function CatalogoProvider({ children }: { children: ReactNode }) {
  // Copia o catálogo mockado pra dentro do state — a partir daqui, o catálogo central (produtos.mock.ts) continua sendo a fonte inicial, mas quem manda no que é exibido nas telas passa a ser este state (reativo).
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_MOCK);
  const [ferramentaSelecionadaId, setFerramentaSelecionadaId] = useState<number | null>(null);

  const adicionarProduto: CatalogoContextType['adicionarProduto'] = (dados) => {
    const novoProduto: Produto = {
      ...dados,
      id: Date.now(),
      meuAnuncio: true,
    };

    setProdutos((atuais) => [novoProduto, ...atuais]);

    return novoProduto;
  };

  const atualizarProduto: CatalogoContextType['atualizarProduto'] = (id, dadosAtualizados) => {
    setProdutos((atuais) =>
      atuais.map((produto) => (produto.id === id ? { ...produto, ...dadosAtualizados } : produto)),
    );
  };

  const removerProduto: CatalogoContextType['removerProduto'] = (id) => {
    setProdutos((atuais) => atuais.filter((produto) => produto.id !== id));
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
    <CatalogoContext.Provider
      value={{
        produtos,
        adicionarProduto,
        atualizarProduto,
        removerProduto,
        adicionarAvaliacaoProduto,
        ferramentaSelecionadaId,
        setFerramentaSelecionadaId,
      }}
    >
      {children}
    </CatalogoContext.Provider>
  );
}

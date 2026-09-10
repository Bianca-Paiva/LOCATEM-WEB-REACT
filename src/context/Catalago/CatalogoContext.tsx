import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Produto } from '../../types/Produto/produto.types';
import type { AvaliacaoProduto } from '../../pages/ProdutoDetalhe/ProdutoDetalhe.types';
import { PRODUTOS_MOCK } from '../../mocks/produtos.mock';

interface CatalogoContextType {
  /** Fonte única de verdade do catálogo de ferramentas (mock inicial + novos anúncios). */
  produtos: Produto[];
  /** Cria uma ferramenta a partir dos dados do formulário de cadastro e a insere no topo do catálogo. */
  adicionarProduto: (dados: Omit<Produto, 'id' | 'meuAnuncio'>) => Produto;
  /** Atualiza os dados de uma ferramenta existente (edição, mudança de status, pausar/reativar anúncio). */
  atualizarProduto: (id: number, dadosAtualizados: Partial<Produto>) => void;
  /** Remove uma ferramenta do catálogo (usado em "Remover ferramenta", após confirmação). */
  removerProduto: (id: number) => void;
  /**
   * Adiciona uma avaliação real ao produto (identificado pelo título, mesma convenção de correspondência por nome já usada para locadores — ver mocks/locadores.mock.ts). A partir daí, a média/quantidade de avaliações do produto (calculadas em utils/avaliacoesResumo.ts) já refletem essa avaliação automaticamente.
   */
  adicionarAvaliacaoProduto: (tituloProduto: string, avaliacao: AvaliacaoProduto) => void;
  /** Id da ferramenta selecionada em "Minhas Ferramentas" (via "Ver"/"Editar") — lido pela página de Detalhe da Ferramenta e pelo Cadastro de Ferramenta (modo edição). */
  ferramentaSelecionadaId: number | null;
  setFerramentaSelecionadaId: (id: number | null) => void;
}

export const CatalogoContext = createContext<CatalogoContextType | null>(null);

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
import { createContext } from 'react';
import type { Produto } from '../../../types/Ferramentas/produto.types';
import type { AvaliacaoProduto } from '../../../pages/Ferramentas/ProdutoDetalhe/ProdutoDetalhe.types';

export interface CatalogoContextType {
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

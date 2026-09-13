import { PRODUTOS_MOCK } from '../../mocks/produtos.mock';
import { toProdutoSelecionado } from '../../mocks/produtos.adapters';

/**
 * Produto de fallback exibido quando não há produto selecionado no store
 * (ex: acesso direto via hash). Os dados completos (descrição, especificações
 * técnicas, acessórios e avaliações) vêm do catálogo central
 * (`src/mocks/produtos.mock.ts`) através do adapter `toProdutoSelecionado` —
 * cada ferramenta tem seus próprios dados, sem mocks fixos genéricos.
 */
export const FALLBACK_PRODUTO = toProdutoSelecionado(
    PRODUTOS_MOCK.find((p) => p.id === 1)!,
);

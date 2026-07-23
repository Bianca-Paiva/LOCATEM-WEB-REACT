import { PRODUTOS_MOCK } from '../../mocks/produtos.mock';
import { toProdutoBusca } from '../../mocks/produtos.adapters';

/**
 * Mock temporário para testes de layout e fluxo da página de busca.
 * Os dados vêm do catálogo central (`src/mocks/produtos.mock.ts`);
 * aqui só selecionamos os itens e recortamos os campos que a Busca usa.
 */
export const produtosBuscaMock = PRODUTOS_MOCK
    .filter((p) => p.id >= 15 && p.id <= 24)
    .map(toProdutoBusca);

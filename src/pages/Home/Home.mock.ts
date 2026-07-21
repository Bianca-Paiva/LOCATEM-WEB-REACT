import { PRODUTOS_MOCK } from '../../mocks/produtos.mock';
import { toProdutoHome } from '../../mocks/produtos.adapters';

/**
 * Mock temporário para testes de layout e fluxo da página Home.
 * Os dados vêm do catálogo central (`src/mocks/produtos.mock.ts`);
 * aqui só selecionamos os itens e recortamos os campos que a Home usa.
 */
export const MOCK_PRODUCTS = PRODUTOS_MOCK
    .filter((p) => p.id >= 1 && p.id <= 8)
    .map(toProdutoHome);

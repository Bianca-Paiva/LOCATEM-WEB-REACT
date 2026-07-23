import type { EspecificacaoTecnica, AvaliacaoProduto } from './ProdutoDetalhe.types';
import { PRODUTOS_MOCK } from '../../mocks/produtos.mock';
import { toProdutoSelecionado, toProdutoSemelhante } from '../../mocks/produtos.adapters';

/**
 * Mock temporário para testes de layout e fluxo da página de detalhe do produto.
 * Os dados de produto vêm do catálogo central (`src/mocks/produtos.mock.ts`);
 * aqui só selecionamos os itens e recortamos os campos que esta página usa.
 * Especificações técnicas e avaliações continuam locais, pois não fazem
 * parte do catálogo de produtos.
 */

// ── Produto de fallback (exibido quando não há produto selecionado no store) ──
export const FALLBACK_PRODUTO = toProdutoSelecionado(
    PRODUTOS_MOCK.find((p) => p.id === 1)!,
);

// ── Produtos semelhantes exibidos no carrossel ──────────────────────────────
export const MOCK_SEMELHANTES = PRODUTOS_MOCK
    .filter((p) => p.id >= 10 && p.id <= 14)
    .map(toProdutoSemelhante);

export const MOCK_ESPECIFICACOES: EspecificacaoTecnica[] = [
    { label: 'Potência de saída', valor: 'Bateria de Íon-lítio de 18V máx' },
    { label: 'Torque máximo', valor: '65 Nm' },
    { label: 'Tamanho do mandril', valor: '13mm Sem chave' },
    { label: 'Acessórios incluídos', valor: '2 baterias, carregador, estojo rígido, conjunto de 10 bits' },
];

export const MOCK_AVALIACOES: AvaliacaoProduto[] = [
    {
        nome: 'João Silva',
        rating: 5,
        tempo: 'Há 2 dias',
        texto: 'Furadeira muito boa, usei pra montar um guarda-roupa inteiro. Super potente e a bateria durou o projeto todo.',
        fotos: ['src/assets/ProdutosImg/FuradeiraTheBlackTools.png', 'src/assets/ProdutosImg/FuradeiraTheBlackTools.png', 'src/assets/ProdutosImg/FuradeiraTheBlackTools.png'],
        utilCount: 12,
    },
    {
        nome: 'Maria Souza',
        rating: 5,
        tempo: 'Há 1 semana',
        texto: 'O equipamento foi perfeito. O atendimento na entrega foi excelente também.',
        fotos: [],
        utilCount: 5,
    },
    {
        nome: 'Pedro Ribeiro',
        rating: 4,
        tempo: 'Há 2 semanas',
        texto: 'Máquina limpa e pronta para uso. Recomendo.',
        fotos: [],
        utilCount: 2,
    },
];
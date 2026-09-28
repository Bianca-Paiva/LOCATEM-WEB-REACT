import type { ProdutoSelecionado } from '../../src/context/Ferramentas/Produto/ProdutoContext';
import type { DadosLocacaoModal } from '../../src/components/Locacoes/SolicitarLocacao/SolicitarLocacaoModal/SolicitarLocacaoModal.types';

/*
 * Massa minima para testar carrinho e checkout.
 * Mantem produto, periodo, quantidade, frete e totais sincronizados com o formato
 * que os contextos recebem da tela de detalhe.
 */
export const produtoSelecionadoFixture: ProdutoSelecionado = {
  id: 1,
  title: 'Furadeira de Teste',
  marca: 'Bosch',
  price: '25,00',
  images: ['src/assets/ProdutosImg/FuradeiraBosch.png'],
  imageVerificado: 'codicon:verified-filled',
  imageNota: 'lucide:star',
  rating: 4.8,
  reviewCount: 10,
  locador: 'Loja Teste',
  locadorId: 'loc-teste',
  localizacao: 'Sao Paulo - SP',
  categoria: 'Ferramentas Eletricas',
  estoqueDisponivel: 4,
  paymentMethods: ['Pix'],
  available: true,
  status: 'disponivel',
  descricao: 'Produto para testes de carrinho.',
  especificacoes: [],
  acessorios: [],
  avaliacoes: [],
  distribuicaoAvaliacoes: [100, 0, 0, 0, 0],
  tipoAprovacao: 'automatica',
};

export const dadosLocacaoFixture: DadosLocacaoModal = {
  quantidade: 2,
  horarioEntrega: '09:00',
  horarioDevolucao: '18:00',
  resumo: {
    dataEntregaFormatada: '01/10/2026',
    dataDevolucaoFormatada: '03/10/2026',
    diarias: 2,
    quantidadeFormatada: '2 unidades',
    aluguel: 100,
    aluguelFormatado: 'R$ 100,00',
    frete: 10,
    freteFormatado: 'R$ 10,00',
    valor: 110,
    valorFormatado: 'R$ 110,00',
  },
};

import type { AvaliacaoProduto } from '../../pages/ProdutoDetalhe/ProdutoDetalhe.types';

/**
 * Status operacional de uma ferramenta do ponto de vista do LOCADOR.
 * Usado em "Minhas Ferramentas" e na página de detalhe da ferramenta (locador).
 *
 * `available` continua existindo (usado pelos filtros de Busca/Home, visão do
 * locatário) e é sempre derivado deste status: só é `true` quando `status === 'disponivel'`.
 */
export type StatusFerramenta = 'disponivel' | 'locada' | 'indisponivel' | 'manutencao';

/**
 * Tipo mestre de Produto (ferramenta).
 * Reúne TODOS os campos que qualquer página do app pode precisar exibir.
 *
 * Cada página tem seu próprio tipo "recortado" (ex: ProdutoHome, ProdutoBusca)
 * com apenas os campos que ela de fato usa. Os adapters em `produtos.adapters.ts`
 * fazem a conversão de Produto -> tipo da página.
 */
export interface Produto {
    id: number;
    title: string;
    marca: string;
    price: string;
    images: string[];
    imageVerificado: string;
    imageNota: string;
    rating: number;
    reviewCount: number;
    locador: string; /** Nome do locador/anunciante do produto */
    locadorId: string; /** Identificador único do locador dono do anúncio (ver mocks/locadores.mock.ts) — usado para filtrar "Minhas Ferramentas"/"Gerenciar Locações" pelo locador autenticado. */
    localizacao: string; /** Localização do locador, ex: "São Paulo - SP" */
    categoria: string; /** Categoria da ferramenta, ex: "Elétrica • Parafusadeira/Furadeira" */
    estoqueDisponivel: number; /** Quantidade máxima disponível para reserva */
    paymentMethods: string[]; /** Formas de pagamento aceitas, ex: ["Pix", "Cartão de Crédito"] */
    available: boolean; /** Se está disponível para locação no momento (derivado de `status === 'disponivel'`) */
    status: StatusFerramenta; /** Estado operacional da ferramenta, controlado pelo locador em "Minhas Ferramentas" */
    cadastradoEm?: string; /** Data de cadastro do anúncio, formatada "dd/mm/aaaa" */
    meuAnuncio?: boolean; /** Marca ferramentas publicadas pelo usuário atual (fluxo de Cadastro de Ferramenta) */
    descricao?: string; /** Descrição livre da ferramenta, escrita pelo locador no cadastro */
    especificacoes?: { label: string; valor: string }[]; /** Especificações técnicas em pares chave/valor */
    acessorios?: string[]; /** Itens inclusos que acompanham a ferramenta */
    caucao?: string; /** Valor de caução (opcional), devolvido após a locação */
    diasIndisponiveis?: string[]; /** Datas ("yyyy-mm-dd") em que a ferramenta não está disponível */
    tipoAprovacao?: 'manual' | 'automatica'; /** Forma como as solicitações de locação são aprovadas */
    voltagem?: string; /** Voltagem/fonte de alimentação, ex: "220V", "127V", "Bivolt", "À bateria", "Manual". Reflete as opções do formulário de cadastro. */
    avaliacoes?: AvaliacaoProduto[]; /** Avaliações específicas desta ferramenta, exibidas na página de detalhe */
    distribuicaoAvaliacoes?: number[]; /** Distribuição percentual das notas [5,4,3,2,1] estrelas, deve somar ~100 */
}
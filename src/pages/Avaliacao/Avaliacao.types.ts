/**
    * Tipos do fluxo de Avaliações.
    * Centralizados aqui para serem reaproveitados pela página, pelos componentes e pelos hooks relacionados.
 */

export type StatusAvaliacao = 'pendente' | 'realizada';

/** Quem está avaliando — define quais aspectos aparecem no modal (ver CHAVES_SUB_AVALIACAO). */
export type PerspectivaAvaliacao = 'locatario' | 'locador';

/** Aspectos avaliados pelo locatário, depois que a ferramenta é devolvida ao locador. */
export type ChaveSubAvaliacaoLocatario = 'locador' | 'entrega' | 'produto' | 'plataforma';

/** Aspectos avaliados pelo locador, depois que ele recebe a ferramenta de volta. */
export type ChaveSubAvaliacaoLocador = 'locatario' | 'entrega' | 'plataforma';

export type ChaveSubAvaliacao = ChaveSubAvaliacaoLocatario | ChaveSubAvaliacaoLocador;

/**
 * Notas por aspecto. Parcial porque o conjunto de chaves preenchidas depende da perspectiva de quem avaliou (locatário avalia 4 aspectos, locador avalia 3).
 */
export type SubAvaliacoes = Partial<Record<ChaveSubAvaliacao, number>>;

export interface LojaProduto {
    nome: string;
    /** `null` quando o locador não tem logo cadastrada (fallback: ícone de imagem quebrada). */
    logo: string | null;
}

/** Avaliação já enviada (por locatário ou locador), persistida na própria locação avaliada. */
export interface RegistroAvaliacao {
    subAvaliacoes: SubAvaliacoes;
    notaGlobal: number;
    observacao: string;
}

export interface ProdutoAvaliacao {
    id: string;
    nome: string;
    dataLocacao: string;
    imagem: string;
    status: StatusAvaliacao;
    notaGlobal: number;
    subAvaliacoes: SubAvaliacoes;
    observacao: string;
    loja: LojaProduto;
    /** Locação de origem desta avaliação — garante o vínculo com a locação (e não com o produto/usuário) correta. */
    locacaoId: string;
    /** Perspectiva de quem avalia nesta entrada — decide os aspectos exibidos e o rótulo do produto/loja. */
    perspectiva: PerspectivaAvaliacao;
}

export type AbaAvaliacao = 'pendentes' | 'realizadas';

/** Labels usados nos aspectos de sub-avaliação do modal, por chave. */
export const LABEL_SUB_AVALIACAO: Record<ChaveSubAvaliacao, string> = {
    locador: 'Avaliação Locador',
    locatario: 'Avaliação Locatário',
    entrega: 'Avaliação Entrega',
    produto: 'Avaliação Produto',
    plataforma: 'Avaliação Plataforma',
};

/**
 * Quais aspectos — e em que ordem — aparecem no modal, de acordo com a perspectiva de quem avalia. Única fonte de verdade para isso: evita repetir a lista de aspectos em cada componente/hook do fluxo de avaliação.
 */
export const CHAVES_SUB_AVALIACAO: Record<PerspectivaAvaliacao, ChaveSubAvaliacao[]> = {
    locatario: ['locador', 'entrega', 'produto', 'plataforma'],
    locador: ['locatario', 'entrega', 'plataforma'],
};
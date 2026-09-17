import logoLojaMS from '../assets/LogosLojas/logoLojaMS.png';
import logoLojaJB from '../assets/LogosLojas/logoLojaJB.png';

export interface Locador {
    /** Identificador único do locador — usado para ligar produtos/locações ao locador autenticado (ver types/usuario.types.ts `locadorId`). */
    id: string;
    nome: string;
    logoUrl?: string;
    rating: number;
    reviewCount: number;
    locacoes: number;
    verificado: boolean;
}

/**
 * Catálogo central de locadores (lojas parceiras que anunciam ferramentas).
 *
 * Fonte única de verdade para os dados exibidos no card "InfoVendedor".
 * `Produto.locador` (em produtos.mock.ts) guarda apenas o NOME do locador;
 * os demais dados (rating, avaliações, locações, verificado, logo) vêm
 * sempre daqui, por nome — assim um mesmo locador nunca aparece com
 * números diferentes em produtos diferentes, e nenhum componente precisa
 * hardcodar esses valores.
 */
export const LOCADORES_MOCK: Locador[] = [
    {
        id: 'loc-ms',
        nome: 'MS Ferramentas',
        logoUrl: logoLojaMS,
        rating: 4.0,
        reviewCount: 20,
        locacoes: 500,
        verificado: true,
    },
    {
        id: 'loc-wz',
        nome: 'WZ Ferramentas',
        rating: 4.3,
        reviewCount: 96,
        locacoes: 180,
        verificado: true,
    },
    {
        id: 'loc-jb',
        nome: 'JB Ferramentas',
        logoUrl: logoLojaJB,
        rating: 4.9,
        reviewCount: 200,
        locacoes: 500,
        verificado: true,
    },
];

/** Busca um locador pelo nome; retorna um fallback seguro caso não seja encontrado no catálogo. */
export const getLocadorByNome = (nome: string): Locador => {
    const encontrado = LOCADORES_MOCK.find((l) => l.nome === nome);
    if (encontrado) return encontrado;

    return {
        id: '',
        nome,
        rating: 0,
        reviewCount: 0,
        locacoes: 0,
        verificado: false,
    };
};

/** Busca um locador pelo identificador único — fonte usada para ligar o locador autenticado (Usuario.locadorId) às suas ferramentas e locações (Produto.locadorId). */
export const getLocadorById = (id: string): Locador | undefined =>
    LOCADORES_MOCK.find((l) => l.id === id);
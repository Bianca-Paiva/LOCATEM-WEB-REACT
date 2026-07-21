export interface Locador {
    nome: string;
    logoUrl?: string;
    rating: number;
    reviewCount: number;
    locacoes: number;
    verificado: boolean;
}

/**
 * Catálogo central de locadores (lojas/pessoas que anunciam ferramentas).
 *
 * Fonte única de verdade para os dados exibidos no card "InfoVendedor".
 * `Produto.locador` (em produtos.mock.ts) guarda apenas o NOME do locador;
 * os demais dados (rating, avaliações, locações, verificado) vêm sempre
 * daqui, por nome — assim um mesmo locador nunca aparece com números
 * diferentes em produtos diferentes, e nenhum componente precisa
 * hardcodar esses valores.
 */
export const LOCADORES_MOCK: Locador[] = [
    {
        nome: 'JB Ferramentas',
        rating: 4.9,
        reviewCount: 200,
        locacoes: 500,
        verificado: true,
    },
    {
        nome: 'WZ Ferramentas',
        rating: 4.3,
        reviewCount: 96,
        locacoes: 180,
        verificado: true,
    },
    {
        nome: 'João Ferramentas',
        rating: 4.7,
        reviewCount: 150,
        locacoes: 310,
        verificado: true,
    },
    {
        nome: 'MS Ferramentas',
        rating: 4.0,
        reviewCount: 20,
        locacoes: 500,
        verificado: true,
    },
];

/** Busca um locador pelo nome; retorna um fallback seguro caso não seja encontrado no catálogo. */
export const getLocadorByNome = (nome: string): Locador => {
    const encontrado = LOCADORES_MOCK.find((l) => l.nome === nome);
    if (encontrado) return encontrado;

    return {
        nome,
        rating: 0,
        reviewCount: 0,
        locacoes: 0,
        verificado: false,
    };
};

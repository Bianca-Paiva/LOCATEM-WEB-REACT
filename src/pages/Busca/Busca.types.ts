/**
 * Tipos da página de Busca.
 * Centralizados aqui para serem reaproveitados pela página, pelos componentes e pelos hooks relacionados.
 */

export interface ProdutoBusca {
    id: number;
    title: string;
    brand: string;
    category: string;
    price: string;
    images: string[];
    imageVerificado: string;
    imageNota: string;
    rating: number;
    reviewCount: number;
    paymentMethods: string[];
    available: boolean;
    locador: string;
    localizacao: string;
    estoqueDisponivel: number;
    /** Voltagem/fonte de alimentação, ex: "220V", "127V", "Bivolt", "À bateria", "Manual". Reflete as opções do cadastro de ferramenta. */
    voltagem?: string;
}

export interface FilterState {
    categories: string[];
    brands: string[];
    brandSearch: string;
    voltagens: string[];
    priceRanges: string[];
    paymentMethods: string[];
    availability: string | null;
    minRating: number | null;
}
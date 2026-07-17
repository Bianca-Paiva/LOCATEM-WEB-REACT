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
}

export interface FilterState {
    categories: string[];
    brands: string[];
    brandSearch: string;
    priceRanges: string[];
    paymentMethods: string[];
    availability: string | null;
    minRating: number | null;
}
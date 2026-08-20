/**
    * Tipos do fluxo da Home.
    * Centralizados aqui para serem reaproveitados pela página, pelos componentes e pelos hooks relacionados.
 */

export interface ProdutoHome {
    id: number;
    title: string;
    brand: string;
    price: string;
    images: string[];
    imageVerificado: string;
    imageNota: string;
    rating: number;
    reviewCount: number;
    tipoAprovacao?: 'manual' | 'automatica';
}
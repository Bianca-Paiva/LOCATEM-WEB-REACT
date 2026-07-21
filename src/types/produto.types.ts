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
    brand: string;
    price: string;
    images: string[];
    imageVerificado: string;
    imageNota: string;
    rating: number;
    reviewCount: number;
    locador: string; /** Nome do locador/anunciante do produto */
    localizacao: string; /** Localização do locador, ex: "São Paulo - SP" */
    categoria: string; /** Categoria da ferramenta, ex: "Elétrica • Parafusadeira/Furadeira" */
    estoqueDisponivel: number; /** Quantidade máxima disponível para reserva */
    paymentMethods: string[]; /** Formas de pagamento aceitas, ex: ["Pix", "Cartão de Crédito"] */
    available: boolean; /** Se está disponível para locação no momento */
}

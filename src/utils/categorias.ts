import type { Produto } from '../types/produto.types';

/**
 * Deriva categorias e subcategorias a partir do catálogo real de produtos.
 *
 * `Produto.categoria` guarda categoria e subcategoria juntas numa única string
 * (ex: "Ferramentas Elétricas • Corte e Desgaste"). Este módulo é a única fonte usada para "desmontar" esse formato — assim o CategoryFilter (Home) e os filtros da página de Busca sempre exibem exatamente as categorias que existem nas ferramentas cadastradas, sem manter uma lista paralela que possa ficar dessincronizada dos dados reais.
 */
const SEPARADOR_SUBCATEGORIA = ' • ';

export interface CategoriaComSubcategorias {
  /** Nome da categoria de topo, ex: "Ferramentas Elétricas". */
  categoria: string;
  /**
   * Valores completos de `Produto.categoria` para cada subcategoria dessa categoria (ex: "Ferramentas Elétricas • Pintura") — já no formato usado para comparar com o campo `categoria`/`category` dos produtos.
   */
  subcategorias: string[];
}

/** Extrai só a categoria de topo (sem subcategoria) do campo `categoria` de um produto. */
export function extrairCategoriaTopo(categoria: string): string {
  return categoria.split(SEPARADOR_SUBCATEGORIA)[0];
}

/** Extrai só o rótulo da subcategoria (sem repetir o nome da categoria) de um valor completo. */
export function extrairNomeSubcategoria(categoriaCompleta: string): string {
  return categoriaCompleta.split(SEPARADOR_SUBCATEGORIA)[1] ?? categoriaCompleta;
}

/**
 * Agrupa os produtos por categoria de topo, coletando as subcategorias reais de cada uma (na ordem em que aparecem no catálogo). Categorias sem subcategoria (ex: "Jardinagem e Paisagismo") retornam `subcategorias: []`.
 */
export function derivarCategorias(produtos: Produto[]): CategoriaComSubcategorias[] {
  const mapa = new Map<string, string[]>();

  for (const produto of produtos) {
    const categoriaTopo = extrairCategoriaTopo(produto.categoria);
    const subcategorias = mapa.get(categoriaTopo) ?? [];

    if (produto.categoria.includes(SEPARADOR_SUBCATEGORIA) && !subcategorias.includes(produto.categoria)) {
      subcategorias.push(produto.categoria);
    }

    mapa.set(categoriaTopo, subcategorias);
  }

  return Array.from(mapa.entries()).map(([categoria, subcategorias]) => ({ categoria, subcategorias }));
}

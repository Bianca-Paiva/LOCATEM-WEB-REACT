import type { Produto } from '../../types/Ferramentas/produto.types';

/*
 * Regras puras do catalogo.
 * Ficam fora dos componentes para que Home, checkout e testes usem a mesma
 * definicao de disponibilidade, filtro e calculo de locacao.
 */
export const CATEGORIA_TODOS = 'Todos';

// Produto so entra na vitrine quando esta ativo, disponivel e com estoque.
export function produtoEstaDisponivel(produto: Produto): boolean {
  return produto.available && produto.status === 'disponivel' && produto.estoqueDisponivel > 0;
}

// O filtro "Todos" preserva a lista original; os demais filtros restringem por categoria exata.
export function filtrarProdutosPorCategoria<T extends { categoria: string }>(
  produtos: T[],
  categoriaSelecionada: string,
): T[] {
  if (categoriaSelecionada === CATEGORIA_TODOS) {
    return produtos;
  }

  return produtos.filter((produto) => produto.categoria === categoriaSelecionada);
}

// Calculo defensivo usado para impedir totais negativos ou periodos invalidos.
export function calcularValorLocacao(precoDiaria: number, quantidade: number, diarias: number): number {
  if (precoDiaria < 0 || quantidade < 1 || diarias < 1) return 0;
  return precoDiaria * quantidade * diarias;
}

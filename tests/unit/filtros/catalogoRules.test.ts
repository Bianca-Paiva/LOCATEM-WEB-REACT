import { describe, expect, it } from 'vitest';
import {
  CATEGORIA_TODOS,
  calcularValorLocacao,
  filtrarProdutosPorCategoria,
  produtoEstaDisponivel,
} from '../../../src/utils/Ferramentas/catalogoRules';
import { PRODUTOS_MOCK } from '../../../src/mocks/produtos.mock';

/*
 * Testes das regras puras do catalogo.
 * Protegem filtros, disponibilidade e calculo de locacao sem precisar renderizar a Home.
 */
describe('filtro de categorias', () => {
  it('deve retornar todos os produtos quando Todos estiver selecionado', () => {
    const produtos = [
      { id: 1, categoria: 'Ferramentas Eletricas' },
      { id: 2, categoria: 'Jardinagem' },
    ];

    expect(filtrarProdutosPorCategoria(produtos, CATEGORIA_TODOS)).toEqual(produtos);
  });

  it('deve retornar apenas produtos da categoria selecionada', () => {
    const produtos = [
      { id: 1, categoria: 'Ferramentas Eletricas' },
      { id: 2, categoria: 'Jardinagem' },
      { id: 3, categoria: 'Jardinagem' },
    ];

    expect(filtrarProdutosPorCategoria(produtos, 'Jardinagem')).toEqual([
      { id: 2, categoria: 'Jardinagem' },
      { id: 3, categoria: 'Jardinagem' },
    ]);
  });
});

describe('regras de catalogo', () => {
  it('deve considerar disponivel apenas produto ativo, com estoque e marcado como disponivel', () => {
    const produtoDisponivel = PRODUTOS_MOCK[0];
    const produtoSemEstoque = { ...produtoDisponivel, estoqueDisponivel: 0 };
    const produtoLocado = { ...produtoDisponivel, status: 'locada' as const };

    expect(produtoEstaDisponivel(produtoDisponivel)).toBe(true);
    expect(produtoEstaDisponivel(produtoSemEstoque)).toBe(false);
    expect(produtoEstaDisponivel(produtoLocado)).toBe(false);
  });

  it('deve calcular preco por diaria, quantidade e periodo', () => {
    expect(calcularValorLocacao(25, 2, 3)).toBe(150);
  });

  it('deve zerar calculo quando quantidade ou periodo forem invalidos', () => {
    expect(calcularValorLocacao(25, 0, 3)).toBe(0);
    expect(calcularValorLocacao(25, 2, 0)).toBe(0);
    expect(calcularValorLocacao(-1, 2, 3)).toBe(0);
  });
});

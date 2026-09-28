import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useCarrinhoStore } from '../../../src/hooks/Checkout/Carrinho/useCarrinhoStore';
import { dadosLocacaoFixture, produtoSelecionadoFixture } from '../../fixtures/carrinho';
import { renderComProviders, tokenLocador, tokenLocatario } from '../../utils/render';

/*
 * Harness pequeno para exercitar o CarrinhoProvider como o componente faria.
 * Mantem assercoes focadas em regras de negocio: permissao por perfil e recalculo de totais.
 */
function CarrinhoHarness() {
  const { itens, adicionarItem, atualizarQuantidade, atualizarDias } = useCarrinhoStore();
  const primeiroItem = itens[0];

  return (
    <div>
      <span data-testid="quantidade-itens">{itens.length}</span>
      <span data-testid="quantidade-produto">{primeiroItem?.dados.quantidade ?? 0}</span>
      <span data-testid="diarias">{primeiroItem?.dados.resumo.diarias ?? 0}</span>
      <span data-testid="total">{primeiroItem?.dados.resumo.valorFormatado ?? 'R$ 0,00'}</span>
      <button type="button" onClick={() => adicionarItem(produtoSelecionadoFixture, dadosLocacaoFixture)}>
        adicionar
      </button>
      <button
        type="button"
        onClick={() => primeiroItem && atualizarQuantidade(primeiroItem.id, 3)}
      >
        quantidade
      </button>
      <button type="button" onClick={() => primeiroItem && atualizarDias(primeiroItem.id, 4)}>
        diarias
      </button>
    </div>
  );
}

describe('logica do carrinho', () => {
  it('deve adicionar item para locatario e recalcular quantidade e periodo', async () => {
    const user = userEvent.setup();
    renderComProviders(<CarrinhoHarness />, { token: tokenLocatario });

    await user.click(screen.getByRole('button', { name: 'adicionar' }));
    expect(screen.getByTestId('quantidade-itens')).toHaveTextContent('1');

    await user.click(screen.getByRole('button', { name: 'quantidade' }));
    expect(screen.getByTestId('quantidade-produto')).toHaveTextContent('3');
    expect(screen.getByTestId('total')).toHaveTextContent('R$ 160,00');

    await user.click(screen.getByRole('button', { name: 'diarias' }));
    expect(screen.getByTestId('diarias')).toHaveTextContent('4');
    expect(screen.getByTestId('total')).toHaveTextContent('R$ 310,00');
  });

  it('nao deve permitir que locador adicione item ao carrinho', async () => {
    const user = userEvent.setup();
    renderComProviders(<CarrinhoHarness />, { token: tokenLocador });

    await user.click(screen.getByRole('button', { name: 'adicionar' }));

    expect(screen.getByTestId('quantidade-itens')).toHaveTextContent('0');
  });
});

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Carrinho } from '../../../src/pages/Checkout/Carrinho/Carrinho';
import { useCarrinhoStore } from '../../../src/hooks/Checkout/Carrinho/useCarrinhoStore';
import type { Route } from '../../../src/router/useRouter';
import { dadosLocacaoFixture, produtoSelecionadoFixture } from '../../fixtures/carrinho';
import { renderComProviders, tokenLocador, tokenLocatario } from '../../utils/render';

/*
 * Monta o carrinho ja com um item para validar decisoes da tela.
 * A suite cobre visitante indo ao login, locatario bloqueado sem frete e locador redirecionado.
 */
function CarrinhoComItem({ navigate }: { navigate: (route: Route) => void }) {
  const { itens, adicionarItem } = useCarrinhoStore();

  if (itens.length === 0) {
    adicionarItem(produtoSelecionadoFixture, dadosLocacaoFixture);
  }

  return <Carrinho navigate={navigate} onContinuarParaPagamento={() => navigate('metodoPagamento')} />;
}

describe('fluxo do carrinho', () => {
  it('visitante pode acessar carrinho, mas continuar para pagamento abre login necessario', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    renderComProviders(<CarrinhoComItem navigate={navigate} />);

    await user.click(screen.getByRole('button', { name: 'Continuar para Pagamento' }));

    expect(await screen.findByRole('dialog', { name: 'Login necessário' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Entrar na minha conta' }));
    expect(navigate).toHaveBeenCalledWith('login');
    expect(sessionStorage.getItem('locatem_redirect_apos_login')).toBe('carrinho');
  });

  it('locatario autenticado deve informar frete antes de seguir para pagamento', async () => {
    const user = userEvent.setup();
    renderComProviders(<CarrinhoComItem navigate={() => undefined} />, { token: tokenLocatario });

    await user.click(screen.getByRole('button', { name: 'Continuar para Pagamento' }));

    expect(await screen.findByText('O frete é obrigatório.')).toBeInTheDocument();
  });

  it('locador autenticado deve ser redirecionado para Home ao acessar carrinho', async () => {
    const navigate = vi.fn();
    renderComProviders(<Carrinho navigate={navigate} />, { token: tokenLocador });

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('home'));
  });
});

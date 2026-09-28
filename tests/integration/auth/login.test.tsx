import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Login from '../../../src/pages/Auth/Login/Login';
import { renderComProviders } from '../../utils/render';

/*
 * Login em nivel de tela.
 * Confirma token, navegacao e mensagem de erro usando credenciais mockadas controladas.
 */
describe('Login', () => {
  it('deve autenticar com usuario mockado e navegar para Home', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    renderComProviders(<Login navigate={navigate} />);

    await user.type(screen.getByLabelText(/E-mail/), 'maria.oliveira@exemplo.com');
    await user.type(screen.getByLabelText(/Senha/), 'Teste@123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('home'));
    expect(localStorage.getItem('token')).toBe('locatem-dev:-2');
  });

  it('deve mostrar erro para login invalido sem depender do backend real', async () => {
    const user = userEvent.setup();
    renderComProviders(<Login navigate={() => undefined} />);

    await user.type(screen.getByLabelText(/E-mail/), 'maria.oliveira@exemplo.com');
    await user.type(screen.getByLabelText(/Senha/), 'senha-incorreta');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('E-mail ou senha inválidos.')).toBeInTheDocument();
  });
});

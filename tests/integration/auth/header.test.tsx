import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Header from '../../../src/components/Layout/Header/Header';
import { renderComProviders, tokenLocador, tokenLocatario } from '../../utils/render';

/*
 * Valida navegacao do Header por perfil.
 * O objetivo e impedir que visitante, locatario e locador vejam atalhos indevidos.
 */
describe('Header responsivo e navegacao por perfil', () => {
  it('visitante ve Carrinho e nao recebe itens privados de locador ou locatario', () => {
    const { container } = renderComProviders(<Header currentRoute="home" navigate={() => undefined} />);

    const desktopNav = container.querySelector('[class*="menuNavDesktop"]');
    expect(desktopNav).toBeInTheDocument();
    expect(within(desktopNav).getByText('Carrinho')).toBeInTheDocument();
    expect(within(desktopNav).queryByText('Minhas Ferramentas')).not.toBeInTheDocument();
    expect(within(desktopNav).queryByText('Minhas Locações')).not.toBeInTheDocument();
  });

  it('locatario ve areas privadas de locatario e nao ve areas exclusivas do locador', async () => {
    renderComProviders(<Header currentRoute="home" navigate={() => undefined} />, { token: tokenLocatario });

    expect((await screen.findAllByText('Minhas Locações')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Favoritos').length).toBeGreaterThan(0);
    expect(screen.queryByText('Minhas Ferramentas')).not.toBeInTheDocument();
    expect(screen.queryByText('Gerenciar Locações')).not.toBeInTheDocument();
  });

  it('locador nao ve Carrinho nem busca e ve navegacao de locador', async () => {
    renderComProviders(<Header currentRoute="homeLocador" navigate={() => undefined} />, { token: tokenLocador });

    expect((await screen.findAllByText('Minhas Ferramentas')).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Gerenciar Locações').length).toBeGreaterThan(0);
    expect(screen.queryByText('Carrinho')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Qual ferramenta você precisa hoje?')).not.toBeInTheDocument();
  });

  it('mobile/tablet nao mostra Carrinho no menu lateral, mas mantem icone no header', async () => {
    const user = userEvent.setup();
    renderComProviders(<Header currentRoute="home" navigate={() => undefined} />);

    expect(screen.getAllByRole('link').some((link) => link.className.includes('carrinhoBtn'))).toBe(true);

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const drawer = screen.getByRole('dialog', { name: 'Menu de navegação' });

    expect(within(drawer).queryByText('Carrinho')).not.toBeInTheDocument();
    expect(within(drawer).getByText('Início')).toBeInTheDocument();
  });

  it('deve navegar para HomeLocador pelo logo quando usuario for locador', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    renderComProviders(<Header currentRoute="homeLocador" navigate={navigate} />, { token: tokenLocador });

    await screen.findAllByText('Minhas Ferramentas');
    await user.click(screen.getAllByText('LOCATEM')[1]);

    expect(navigate).toHaveBeenCalledWith('homeLocador');
  });
});

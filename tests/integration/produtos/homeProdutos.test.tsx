import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Home from '../../../src/pages/Home/HomeLocatario/HomeLocatario';
import { PRODUTOS_MOCK } from '../../../src/mocks/produtos.mock';
import { cenariosApi } from '../../mocks/handlers';
import { server } from '../../mocks/server';
import { renderComProviders, tokenLocatario } from '../../utils/render';

/*
 * Home do locatario com MSW.
 * Exercita sucesso da API, lista vazia, erro, loading e filtro de categoria no mesmo contrato da tela real.
 */
describe('Home e produtos com API/MSW', () => {
  it('deve usar produtos reais quando a API retorna ferramentas', async () => {
    renderComProviders(<Home navigate={() => undefined} />, { token: tokenLocatario });

    expect(await screen.findByText('Furadeira API Profissional')).toBeInTheDocument();
    expect(screen.getByText('Aparador API Jardim')).toBeInTheDocument();
    expect(screen.queryByText(PRODUTOS_MOCK[0].title)).not.toBeInTheDocument();
  });

  it('deve usar produtos.mock.ts como fallback quando a API retorna lista vazia', async () => {
    server.use(cenariosApi.ferramentasListaVazia());
    renderComProviders(<Home navigate={() => undefined} />, { token: tokenLocatario });

    expect(await screen.findByText(PRODUTOS_MOCK[0].title)).toBeInTheDocument();
    expect(screen.queryByText('Nenhuma ferramenta na vitrine')).not.toBeInTheDocument();
  });

  it('deve usar fallback de mocks quando a API retorna erro 500', async () => {
    server.use(cenariosApi.ferramentasErro500());
    renderComProviders(<Home navigate={() => undefined} />, { token: tokenLocatario });

    expect(await screen.findByText(PRODUTOS_MOCK[0].title)).toBeInTheDocument();
  });

  it('deve mostrar carregamento enquanto a API demora e depois renderizar a vitrine', async () => {
    server.use(cenariosApi.ferramentasComAtraso());
    renderComProviders(<Home navigate={() => undefined} />, { token: tokenLocatario });

    expect(screen.getByText('Carregando vitrine...')).toBeInTheDocument();
    expect(await screen.findByText('Furadeira API Profissional')).toBeInTheDocument();
  });

  it('filtro Todos exibe todas as ferramentas e filtro especifico restringe por categoria', async () => {
    const user = userEvent.setup();
    renderComProviders(<Home navigate={() => undefined} />, { token: tokenLocatario });

    expect(await screen.findByText('Furadeira API Profissional')).toBeInTheDocument();
    expect(screen.getByText('Aparador API Jardim')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Jardinagem' }));
    await waitFor(() => {
      expect(screen.queryByText('Furadeira API Profissional')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Aparador API Jardim')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Todos' }));
    expect(screen.getByText('Furadeira API Profissional')).toBeInTheDocument();
  });
});

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Busca from '../../../src/pages/Busca/Busca';
import Header from '../../../src/components/Layout/Header/Header';
import { renderComProviders, tokenLocatario } from '../../utils/render';

/*
 * Integra Header e pagina de busca com o catalogo mockado.
 * Garante que a digitacao no campo compartilhado filtre a lista exibida ao usuario.
 */
describe('busca de produtos com mocks', () => {
  it('deve pesquisar ferramentas do catalogo mockado a partir do Header', async () => {
    const user = userEvent.setup();
    renderComProviders(
      <>
        <Header currentRoute="home" navigate={() => undefined} />
        <Busca navigate={() => undefined} />
      </>,
      { token: tokenLocatario },
    );

    await user.type(screen.getAllByPlaceholderText('Qual ferramenta você precisa hoje?')[0], 'Makita');

    expect(screen.getByText('Serra Mármore Makita')).toBeInTheDocument();
    expect(screen.queryByText('Aparador De Grama Bipartido Tramontina')).not.toBeInTheDocument();
  });
});

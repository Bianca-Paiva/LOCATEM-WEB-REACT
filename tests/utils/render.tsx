import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from '../../src/context/Auth/AuthProvider';
import { BuscaProvider } from '../../src/context/Busca/BuscaProvider';
import { CarrinhoProvider } from '../../src/context/Checkout/Carrinho/CarrinhoProvider';
import { CatalogoProvider } from '../../src/context/Ferramentas/Catalago/CatalogoProvider';
import { ProdutoProvider } from '../../src/context/Ferramentas/Produto/ProdutoProvider';
import { FavoritosProvider } from '../../src/context/Conta/Favoritos/FavoritosProvider';

interface RenderOptions {
  token?: string;
}

/*
 * Render padrao para testes de componentes.
 * Envolve a UI com os mesmos providers globais do App e permite iniciar o teste
 * ja autenticado com os tokens mockados de locatario ou locador.
 */
export function renderComProviders(ui: ReactElement, options: RenderOptions = {}) {
  if (options.token) {
    localStorage.setItem('token', options.token);
  }

  return render(
    <AuthProvider>
      <CatalogoProvider>
        <ProdutoProvider>
          <CarrinhoProvider>
            <BuscaProvider>
              <FavoritosProvider>{ui}</FavoritosProvider>
            </BuscaProvider>
          </CarrinhoProvider>
        </ProdutoProvider>
      </CatalogoProvider>
    </AuthProvider>,
  );
}

export const tokenLocatario = 'locatem-dev:-2';
export const tokenLocador = 'locatem-dev:-1';

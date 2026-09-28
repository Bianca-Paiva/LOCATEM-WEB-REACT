import { describe, expect, it } from 'vitest';
import { autenticarUsuarioMock, buscarUsuarioMockPorToken } from '../../../src/mocks/usuarios.mock';
import {
  CHAVE_REDIRECT_APOS_LOGIN,
  lerRedirectAposLogin,
  limparRedirectAposLogin,
  salvarRedirectAposLogin,
} from '../../../src/utils/Auth/redirectAposLogin';

/*
 * Cobre autenticacao mockada de desenvolvimento e redirect pos-login.
 * Esses fluxos sustentam os testes de checkout sem exigir API real de usuarios.
 */
describe('autenticacao mockada', () => {
  it('deve autenticar locatario mockado com senha oficial de desenvolvimento', () => {
    const token = autenticarUsuarioMock('maria.oliveira@exemplo.com', 'Teste@123');

    expect(token).toBe('locatem-dev:-2');
    expect(buscarUsuarioMockPorToken(token ?? '')?.tipo).toBe('locatario');
  });

  it('deve autenticar locador mockado sem criar credenciais duplicadas', () => {
    const token = autenticarUsuarioMock('joao.silva@exemplo.com', 'Teste@123');

    expect(token).toBe('locatem-dev:-1');
    expect(buscarUsuarioMockPorToken(token ?? '')?.tipo).toBe('locador');
  });

  it('deve rejeitar senha invalida', () => {
    expect(autenticarUsuarioMock('maria.oliveira@exemplo.com', 'errada')).toBeUndefined();
  });
});

describe('redirect apos login', () => {
  it('deve salvar, ler e limpar rota valida do checkout', () => {
    salvarRedirectAposLogin('carrinho');

    expect(sessionStorage.getItem(CHAVE_REDIRECT_APOS_LOGIN)).toBe('carrinho');
    expect(lerRedirectAposLogin()).toBe('carrinho');

    limparRedirectAposLogin();
    expect(lerRedirectAposLogin()).toBeNull();
  });

  it('deve ignorar rotas nao autorizadas para redirect', () => {
    sessionStorage.setItem(CHAVE_REDIRECT_APOS_LOGIN, 'homeLocador');

    expect(lerRedirectAposLogin()).toBeNull();
  });
});

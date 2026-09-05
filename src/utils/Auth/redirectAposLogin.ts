// Ponto único de leitura/escrita do sessionStorage para o redirecionamento pós-login (ou cadastro + login) originado no fluxo do Carrinho — ex.: usuário deslogado clica em "Continuar para Pagamento", é levado para o Login e, ao concluir a autenticação, deve voltar exatamente para onde parou, com os itens do carrinho preservados.
//
// Mesmo espírito de utils/pagamentoStorage.ts: única chave usada por este mecanismo — nenhum outro módulo deve acessar 'locatem_redirect_apos_login' diretamente via sessionStorage. Usamos sessionStorage (em vez de localStorage) porque essa marcação é válida apenas para a sessão/fluxo de navegação atual.
import type { Route } from '../../router/useRouter';

export const CHAVE_REDIRECT_APOS_LOGIN = 'locatem_redirect_apos_login';

// Por enquanto, o único ponto de entrada que precisa desse redirecionamento é o Carrinho (botão "Continuar para Pagamento" com o usuário deslogado).
const ROTAS_VALIDAS: Route[] = ['carrinho'];

/** Marca para onde o usuário deve ser levado de volta assim que concluir o login. */
export function salvarRedirectAposLogin(rota: Route): void {
  sessionStorage.setItem(CHAVE_REDIRECT_APOS_LOGIN, rota);
}

/** Lê a rota de redirecionamento pendente, ou null se não houver nenhuma marcada/for inválida. */
export function lerRedirectAposLogin(): Route | null {
  const bruto = sessionStorage.getItem(CHAVE_REDIRECT_APOS_LOGIN);
  return ROTAS_VALIDAS.includes(bruto as Route) ? (bruto as Route) : null;
}

/** Remove a marcação de redirecionamento — chamado assim que o login é concluído e o redirecionamento acontece. */
export function limparRedirectAposLogin(): void {
  sessionStorage.removeItem(CHAVE_REDIRECT_APOS_LOGIN);
}

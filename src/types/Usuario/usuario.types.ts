/**
 * Tipos relacionados ao usuário autenticado (Locatário ou Locador).
 *
 * O projeto ainda não tem uma API real de autenticação (ver services/authService.ts, que possui os endpoints comentados), então esses tipos descrevem o formato que a resposta de login/cadastro deve ter quando essa integração for feita. Por enquanto, o AuthContext preenche esses dados a partir de mocks (ver mocks/usuarios.mock.ts).
 */

/** Mesma nomenclatura já usada em Cadastro (CardOpcaoConta, cadastroSchema). */
export type TipoUsuario = 'locatario' | 'locador';

/** Indicadores de reputação exibidos no card "Reputação" da tela de Perfil. */
export interface ReputacaoUsuario {
  rating: number;
  totalAvaliacoes: number;
  locacoesConcluidas: number;
  /** Só se aplica a Locadores (indicador "entregas no prazo" do protótipo). */
  entregasNoPrazoPercentual?: number;
}

export interface Usuario {
    id: number
    nome: string
    email: string
    telefone: string
    documento: string
    endereco: string
    tipo: TipoUsuario

    fotoUrl?: string
    emailVerificado?: boolean
    desde?: number

    reputacao?: ReputacaoUsuario
}

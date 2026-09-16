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

    /** Vínculo com as ferramentas e locações do locador. */
    locadorId?: string
    fotoUrl?: string
    emailVerificado?: boolean
    desde?: number

    reputacao?: ReputacaoUsuario
}

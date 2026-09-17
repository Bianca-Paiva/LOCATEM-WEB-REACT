// Ponto único de leitura/escrita do sessionStorage para preservar os dados já preenchidos no modal "Detalhes da Locação" (ProdutoDetalhe) enquanto um usuário deslogado é levado para fazer login — ex.: clicou em "Locar agora", preencheu entrega/devolução/quantidade e só ao clicar em "Continuar" descobrimos que precisa se autenticar. Mesmo espírito de utils/Auth/redirectAposLogin.ts e utils/Pagamento/pagamentoStorage.ts.
//
// Única chave usada por este mecanismo — nenhum outro módulo deve acessar 'locatem_locacao_modal_pendente' diretamente via sessionStorage. Usamos sessionStorage (não localStorage) porque a marcação só vale para o fluxo de login atual.

export const CHAVE_LOCACAO_MODAL_PENDENTE = 'locatem_locacao_modal_pendente';

export interface LocacaoModalPendente {
  /** id do produto ao qual os dados pertencem — evita restaurar o formulário em outra ferramenta */
  produtoId?: number;
  quantidade: number;
  dataEntrega: string;
  horarioEntrega: string;
  dataDevolucao: string;
  horarioDevolucao: string;
}

/** Salva o formulário do modal "Detalhes da Locação" antes de levar o usuário deslogado para o Login. */
export function salvarLocacaoModalPendente(dados: LocacaoModalPendente): void {
  sessionStorage.setItem(CHAVE_LOCACAO_MODAL_PENDENTE, JSON.stringify(dados));
}

/** Lê o formulário pendente salvo, ou null se ausente/corrompido. */
export function lerLocacaoModalPendente(): LocacaoModalPendente | null {
  const bruto = sessionStorage.getItem(CHAVE_LOCACAO_MODAL_PENDENTE);
  if (!bruto) return null;

  try {
    return JSON.parse(bruto) as LocacaoModalPendente;
  } catch {
    return null;
  }
}

/** Remove o formulário pendente — chamado assim que os dados são restaurados no modal após o login. */
export function limparLocacaoModalPendente(): void {
  sessionStorage.removeItem(CHAVE_LOCACAO_MODAL_PENDENTE);
}

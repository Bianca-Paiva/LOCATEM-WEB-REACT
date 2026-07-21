/** Estado do formulário de solicitação de reserva */
export interface SolicitarReservaFormState {
  dataEntrega: string; /** Valor bruto do input date, formato ISO "yyyy-mm-dd" */
  horarioEntrega: string; /** Ex: "09:00" */
  dataDevolucao: string; /** Valor bruto do input date, formato ISO "yyyy-mm-dd" */
  horarioDevolucao: string; /** Ex: "18:00" */
  quantidade: number;
}

/** Resumo calculado a partir do formulário, pronto para exibição */
export interface ResumoReservaCalculado {
  periodoFormatado: string; /** Ex: "10/08/2026 até 15/08/2026 (5 diárias)" */
  entregaFormatada: string; /** Ex: "10/08/2026 às 09:00" */
  devolucaoFormatada: string; /** Ex: "15/08/2026 às 18:00" */
  quantidadeFormatada: string; /** Ex: "1 unidade" / "2 unidades" */
  diarias: number;
  valorEstimado: number;
  valorEstimadoFormatado: string; /** Ex: "R$ 200,00" */
  periodoValido: boolean; /** false quando a devolução é igual/anterior à entrega */
}

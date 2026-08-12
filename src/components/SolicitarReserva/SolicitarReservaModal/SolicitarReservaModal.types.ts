/**
 * Tipos do modal de Solicitação de Reserva.
 * Substitui, para o fluxo do modal, os tipos de endereço/contato de
 * `SolicitarReserva.types.ts` — este modal cuida apenas de período,
 * horários e quantidade (o endereço continua sendo pedido depois,
 * na etapa de pagamento/confirmação).
 */

/** Estado do formulário dentro do modal */
export interface ReservaModalFormState {
  dataEntrega: string; /** yyyy-mm-dd */
  horarioEntrega: string; /** Ex: "09:00" */
  dataDevolucao: string; /** yyyy-mm-dd */
  horarioDevolucao: string; /** Ex: "18:00" */
  quantidade: number;
}

/** Resumo calculado exibido dentro do modal */
export interface ResumoReservaModalCalculado {
  dataEntregaFormatada: string; /** Ex: "10/08/2026" */
  dataDevolucaoFormatada: string; /** Ex: "15/08/2026" */
  entregaHorarioFormatado: string; /** Ex: "09:00 às 12:00" */
  devolucaoHorarioFormatado: string; /** Ex: "14:00 às 17:00" */
  diarias: number;
  periodoValido: boolean;
  quantidadeFormatada: string; /** Ex: "2 unidades" */
  aluguel: number;
  aluguelFormatado: string;
  frete: number;
  freteFormatado: string;
  valor: number;
  valorFormatado: string;
  /** true quando datas, horários e quantidade estão todos preenchidos e o período é válido */
  formularioCompleto: boolean;
}

/** Dados devolvidos ao fechar o modal com sucesso (Continuar ou Adicionar ao carrinho) */
export interface DadosReservaModal {
  produtoId?: number;
  dataEntrega: string;
  horarioEntrega: string;
  dataDevolucao: string;
  horarioDevolucao: string;
  quantidade: number;
  resumo: ResumoReservaModalCalculado;
}

/** Qual botão da página de detalhe abriu o modal — define o rótulo/ação do botão de confirmação */
export type ModoAberturaModal = 'locar' | 'carrinho';
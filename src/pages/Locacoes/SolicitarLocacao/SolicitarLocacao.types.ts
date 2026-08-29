/**
 * Tipos do fluxo (não modal) de solicitação de locação: endereço/contato de
 * entrega e devolução, e o resumo de valores exibido junto a esse formulário.
 *
 * Observação: o fluxo atual usa `SolicitarLocacaoModal.types.ts` para
 * período/horários/quantidade dentro do modal. Este arquivo cobre apenas os
 * campos de endereço e contato consumidos por `EnderecoEntrega` e o resumo
 * consumido por `ResumoLocacao`.
 */

/** Estado do formulário de endereço/contato da solicitação de locação */
export interface SolicitarLocacaoFormState {
  cep: string;
  cepDesconhecido: boolean;
  ruaAvenida: string;
  numero: string;
  complemento: string;
  nomeCompleto: string;
  telefoneContato: string;
}

/** Resumo calculado exibido junto ao formulário de solicitação de locação */
export interface ResumoLocacaoCalculado {
  dataEntregaFormatada: string; /** Ex: "10/08/2026" */
  dataDevolucaoFormatada: string; /** Ex: "15/08/2026" */
  diarias: number;
  entregaHorarioFormatado: string; /** Ex: "09:00 às 12:00" */
  devolucaoHorarioFormatado: string; /** Ex: "14:00 às 17:00" */
  aluguelFormatado: string;
  freteFormatado: string;
  valorFormatado: string;
}

/** Estado do formulário de solicitação de reserva */
export interface SolicitarReservaFormState {
  dataEntrega: string; /** Valor bruto do input date, formato ISO "yyyy-mm-dd" */
  horarioEntrega: string; /** Ex: "09:00" */
  dataDevolucao: string; /** Valor bruto do input date, formato ISO "yyyy-mm-dd" */
  horarioDevolucao: string; /** Ex: "18:00" */
  quantidade: number;

  // ── Endereço de entrega e devolução 
  cep: string; /** Ex: "00000-000" */
  cepDesconhecido: boolean; /** true quando o usuário marca "Não sei meu CEP" (dispensa a obrigatoriedade do campo) */
  ruaAvenida: string;
  numero: string;
  complemento: string; /** Opcional: apartamento, bloco, referência... */

  // ── Dados de contato 
  nomeCompleto: string;
  telefoneContato: string;
}

/** Resumo calculado a partir do formulário, pronto para exibição */
export interface ResumoReservaCalculado {
  periodoFormatado: string; /** Ex: "10/08/2026 até 15/08/2026 (5 diárias)" */
  entregaFormatada: string; /** Ex: "10/08/2026 às 09:00" */
  devolucaoFormatada: string; /** Ex: "15/08/2026 às 18:00" */
  quantidadeFormatada: string; /** Ex: "1 unidade" / "2 unidades" */
  diarias: number;
  frete: number;
  freteFormatado: string; /** Ex: "R$ 15,00" */
  valor: number;
  valorFormatado: string; /** Ex: "R$ 200,00" */
  periodoValido: boolean; /** false quando a devolução é igual/anterior à entrega */
  formularioCompleto: boolean; /** true somente quando todos os campos obrigatórios (datas, horários, quantidade e endereço) estão preenchidos e o período é válido */

  // ── Usados no card "Resumo da reserva" (período + caixas de entrega/devolução)
  dataEntregaFormatada: string; /** Ex: "10/08/2026", sem horário */
  dataDevolucaoFormatada: string; /** Ex: "15/08/2026", sem horário */
  entregaHorarioFormatado: string; /** Ex: "09:00 às 12:00" */
  devolucaoHorarioFormatado: string; /** Ex: "14:00 às 17:00" */

  aluguel: number; /** Subtotal do aluguel, sem o frete: diarias * precoDiaria * quantidade */
  aluguelFormatado: string; /** Ex: "R$ 120,00" */
}
/** Converte "45,00" -> 45 (number). Aceita vírgula ou ponto como separador decimal. */
export function paraNumero(valorStr: string): number {
  const numero = Number(valorStr.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(numero) ? numero : 0;
}

/** Formata um número para o padrão monetário brasileiro, ex: 45 -> "R$ 45,00". */
export function formatarValorMonetario(valor: number): string {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

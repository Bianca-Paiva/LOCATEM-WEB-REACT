/**
 * Helpers de formatação de datas no formato "dd/mm/aaaa" (o mesmo em que `dataInicio`/`dataFim` circulam em `LocacaoData`). Centraliza uma lógica que antes estava duplicada em `montarLocacaoData.ts`, `MinhasLocacoes.mock.ts` e `timelineLocacao.ts`.
 */

const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/** Converte "dd/mm/aaaa" em Date, sem depender de fuso horário. Retorna null se a string vier vazia ou malformada. */
export function paraDataBr(dataBr: string): Date | null {
    if (!dataBr) return null;
    const [dia, mes, ano] = dataBr.split('/').map(Number);
    if (!dia || !mes || !ano) return null;
    return new Date(ano, mes - 1, dia);
}

/** Formata "dd/mm/aaaa" para "dd Mon", ex: "23 Jul". */
export function formatarDiaMes(dataBr: string): string {
    const data = paraDataBr(dataBr);
    if (!data) return '';
    return `${String(data.getDate()).padStart(2, '0')} ${MESES_ABREV[data.getMonth()]}`;
}

/** Formata "dd/mm/aaaa" para "dd Mon aaaa", ex: "23 Jul 2024". */
export function formatarDiaMesAno(dataBr: string): string {
    const data = paraDataBr(dataBr);
    if (!data) return '';
    return `${formatarDiaMes(dataBr)} ${data.getFullYear()}`;
}

/** Monta o texto de período exibido nos cards de locação, ex: "15 Jul – 18 Jul 2025". */
export function formatarPeriodoBr(dataInicioBr: string, dataFimBr: string): string {
    const inicio = paraDataBr(dataInicioBr);
    const fim = paraDataBr(dataFimBr);
    if (!inicio || !fim) return '';
    return `${formatarDiaMes(dataInicioBr)} – ${formatarDiaMes(dataFimBr)} ${fim.getFullYear()}`;
}
import styles from './ResumoSolicitacaoCard.module.css';

import type { ReservaData } from '../../../pages/Reservas/MinhasReservas/MinhasReservas.types';

interface ResumoSolicitacaoCardProps {
  reserva: ReservaData;
}

// Converte "dd/mm/yyyy" em Date "pura", sem fuso horário
function parseDataBr(dataBr: string): Date | null {
  if (!dataBr) return null;
  const [dia, mes, ano] = dataBr.split('/').map(Number);
  if (!dia || !mes || !ano) return null;
  return new Date(ano, mes - 1, dia);
}

// Calcula a quantidade de diárias a partir das datas já formatadas ("dd/mm/yyyy")
function calcularDiarias(dataInicio: string, dataFim: string): number {
  const inicio = parseDataBr(dataInicio);
  const fim = parseDataBr(dataFim);
  if (!inicio || !fim) return 0;

  const diffMs = fim.getTime() - inicio.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

export default function ResumoSolicitacaoCard({ reserva }: ResumoSolicitacaoCardProps) {
  const { produto, dataInicio, dataFim, valor } = reserva;
  const diarias = calcularDiarias(dataInicio, dataFim);

  return (
    <section className={styles.card}>
      <h2 className={styles.titulo}>Resumo da solicitação</h2>

      <div className={styles.linha}>
        <span className={styles.rotulo}>Status</span>
        <span className={styles.etiquetaStatus}>
          <span className={styles.ponto} aria-hidden="true" />
          Em análise
        </span>
      </div>

      <div className={styles.linha}>
        <span className={styles.rotulo}>Ferramenta</span>
        <span className={styles.valor}>{produto}</span>
      </div>

      <div className={styles.linha}>
        <span className={styles.rotulo}>Período</span>
        <span className={styles.valorBloco}>
          <span className={styles.valor}>{dataInicio} - {dataFim}</span>
          <span className={styles.diarias}>{diarias} {diarias === 1 ? 'diária' : 'diárias'}</span>
        </span>
      </div>

      <div className={styles.linha}>
        <span className={styles.rotulo}>Valor</span>
        <span className={styles.valorDestaque}>{valor}</span>
      </div>
    </section>
  );
}

import type { ResumoReservaCalculado } from '../../../pages/Reservas/SolicitarReserva/SolicitarReserva.types';
import styles from './ResumoReserva.module.css';

interface ResumoReservaProps {
  resumo: ResumoReservaCalculado;
}

export default function ResumoReserva({ resumo }: ResumoReservaProps) {
  const {
    periodoFormatado,
    entregaFormatada,
    devolucaoFormatada,
    quantidadeFormatada,
    valorEstimadoFormatado,
  } = resumo;

  return (
    <section className={styles.card}>
      <h2 className={styles.titulo}>Resumo da reserva</h2>

      <div className={styles.linhaPeriodo}>
        <span className={styles.rotulo}>Período solicitado</span>
        <span className={styles.valor}>{periodoFormatado}</span>
      </div>

      <div className={styles.linha}>
        <span className={styles.rotulo}>Entrega</span>
        <span className={styles.valor}>{entregaFormatada}</span>
      </div>

      <div className={styles.linha}>
        <span className={styles.rotulo}>Devolução</span>
        <span className={styles.valor}>{devolucaoFormatada}</span>
      </div>

      <div className={styles.linha}>
        <span className={styles.rotulo}>Quantidade</span>
        <span className={styles.valor}>{quantidadeFormatada}</span>
      </div>

      <div className={styles.linhaDestaque}>
        <span className={styles.rotuloDestaque}>Valor estimado</span>
        <span className={styles.valorDestaque}>{valorEstimadoFormatado}</span>
      </div>

      <div className={styles.aviso}>
        <span className={styles.avisoIcone}>i</span>
        <p>O valor final será confirmado após aprovação da reserva pelo locador.</p>
      </div>
    </section>
  );
}

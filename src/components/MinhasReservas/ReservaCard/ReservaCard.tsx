import type { ReservaData } from '../../../pages/MinhasReservas/MinhasReservas.types';
import StatusBadge from '../EtiquetaStatus/EtiquetaStatus';
import calendarioIcon from '../../../assets/IconCalendarioReservas.png';
import userIcon from '../../../assets/IconUser.png';
import styles from './ReservaCard.module.css';

interface ReservaCardProps {
  reserva: ReservaData;
  onVerDetalhes?: (id: string) => void;
}

export default function ReservaCard({ reserva, onVerDetalhes }: ReservaCardProps) {
  const { id, produto, imagem, periodo, locador, status, mensagemStatus } = reserva;

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.cardButton}
        onClick={() => onVerDetalhes?.(id)}
      >
        <div className={styles.miniatura}>
          <img src={imagem} alt={produto} />
        </div>

        <div className={styles.conteudo}>
          <h3 className={styles.titulo}>{produto}</h3>

          <div className={styles.linhaInformacoes}>
            <span className={styles.itemInformacao}>
              <img src={calendarioIcon} alt="" className={styles.iconeInformacao} />
              {periodo}
            </span>
            
            <span className={styles.itemInformacao}>
              <img src={userIcon} alt="" className={styles.iconeInformacao} />
              Locador: {locador}
            </span>
          </div>

          <p className={styles.mensagemStatus}>{mensagemStatus}</p>
        </div>

        <div className={styles.aside}>
          <StatusBadge status={status} />
          <span className={styles.seta} aria-hidden="true" />
        </div>
      </button>
    </article>
  );
}

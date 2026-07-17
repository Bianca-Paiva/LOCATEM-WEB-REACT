import type { StatusReserva } from '../../../pages/Reservas/MinhasReservas/MinhasReservas.types';
import styles from './EtiquetaStatus.module.css';

interface EtiquetaStatusProps {
  status: StatusReserva;
}

// Rótulo exibido dentro de cada badge
const LABEL_BY_STATUS: Record<StatusReserva, string> = {
  pendente: 'Pendente',
  aprovada: 'Aprovada',
  recusada: 'Recusada',
  cancelada: 'Cancelada',
};

export default function EtiquetaStatus({ status }: EtiquetaStatusProps) {
  return (
    <span className={`${styles.etiqueta} ${styles[status]}`}>
      <span className={styles.ponto} aria-hidden="true" />
      {LABEL_BY_STATUS[status]}
    </span>
  );
}

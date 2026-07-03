import {
  CheckIcon,
  ClockIcon,
  DocumentIcon,
  RefreshIcon,
  TruckIcon,
  WarningIcon,
} from '../icons/NotificationIcons';
import type { NotificationData } from '../../../pages/Notificacoes/Notificacoes.types';
import styles from './NotificationCard.module.css';

interface NotificationCardProps {
  notification: NotificationData;
  onRenovar?: (id: string) => void;
  onVerDetalhes?: (id: string) => void;
}

const ICON_BY_TYPE = {
  success: CheckIcon,
  warning: WarningIcon,
  delivery: TruckIcon,
} as const;

export default function NotificationCard({
  notification,
  onRenovar,
  onVerDetalhes,
}: NotificationCardProps) {
  const { id, type, title, description, timestamp, extraInfo, showRenovar } = notification;
  const Icon = ICON_BY_TYPE[type];

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={`${styles.iconWrapper} ${styles[`icon_${type}`]}`}>
          <Icon />
        </span>

        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>

          {extraInfo && (
            <p className={styles.extraInfo}>
              <span className={styles.dot} aria-hidden="true" />
              {extraInfo}
            </p>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        {timestamp ? (
          <span className={styles.timestamp}>
            <ClockIcon />
            {timestamp}
          </span>
        ) : (
          <span />
        )}

        <div className={styles.actions}>
          {showRenovar && (
            <button type="button" className={styles.renovarButton} onClick={() => onRenovar?.(id)}>
              <RefreshIcon />
              Renovar
            </button>
          )}
          <button type="button" className={styles.detailsButton} onClick={() => onVerDetalhes?.(id)}>
            <DocumentIcon />
            Ver detalhes
          </button>
        </div>
      </div>
    </article>
  );
}

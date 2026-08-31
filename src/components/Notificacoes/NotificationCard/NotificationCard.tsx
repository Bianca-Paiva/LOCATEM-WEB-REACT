import {
  AlertTriangle,
  BadgePercent,
  BellRing,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  MessageSquare,
  RefreshCw,
  Truck,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import { STATUS_CONFIG } from '../../MinhasLocacoes/EtiquetaStatus/statusConfig';
import type { NotificationData } from '../../../pages/Notificacoes/Notificacoes.types';
import styles from './NotificationCard.module.css';

interface NotificationCardProps {
  notification: NotificationData;
  onRenovar?: (id: string) => void;
  onVerDetalhes?: (id: string) => void;
}

// Mapeia o "type" (estilo visual) ao ícone correspondente. Usado como fallback quando a
// notificação não possui `statusLocacao` (ex: promoção, mensagem, pagamento recusado).
// Todos os ícones desta tela usam a biblioteca lucide-react, incluindo os mesmos ícones
// usados em EtiquetaStatus (STATUS_CONFIG) para as notificações de locacoes/locações.
const ICON_BY_TYPE: Record<NotificationData['type'], LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  delivery: Truck,
  error: XCircle,
  info: Info,
  promotion: BadgePercent,
  message: MessageSquare,
  reminder: BellRing,
};

export default function NotificationCard({
  notification,
  onRenovar,
  onVerDetalhes,
}: NotificationCardProps) {
  const { id, type, title, description, timestamp, extraInfo, showRenovar, statusLocacao } =
    notification;

  // Quando a notificação está atrelada a uma locacao, usa o mesmo ícone/cor de
  // `STATUS_CONFIG` (o mesmo exibido em 'Minhas Locacoes'); caso contrário, cai no
  // ícone genérico baseado em `type`.
  const configStatus = statusLocacao ? STATUS_CONFIG[statusLocacao] : null;
  const Icon = configStatus ? configStatus.icon : ICON_BY_TYPE[type];
  const iconStyle = configStatus
    ? ({ background: configStatus.fundo, color: configStatus.cor } as React.CSSProperties)
    : undefined;

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span
          className={`${styles.iconWrapper} ${configStatus ? '' : styles[`icon_${type}`]}`}
          style={iconStyle}
        >
          <Icon size={18} strokeWidth={2.25} />
        </span>

        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>

          {/* Linha extra usada apenas pelo card de entrega */}
          {extraInfo && (
            <p className={styles.extraInfo}>
              <span className={styles.dot} aria-hidden="true" />
              {extraInfo}
            </p>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        {/* timestamp vazio (ex: notificação de entrega) não renderiza o relógio */}
        {timestamp ? (
          <span className={styles.timestamp}>
            <Clock size={14} />
            {timestamp}
          </span>
        ) : (
          <span />
        )}

        <div className={styles.actions}>
          {showRenovar && (
            <button type="button" className={styles.renovarButton} onClick={() => onRenovar?.(id)}>
              <RefreshCw size={14} />
              Renovar
            </button>
          )}
          <button type="button" className={styles.detailsButton} onClick={() => onVerDetalhes?.(id)}>
            <FileText size={14} />
            Ver detalhes
          </button>
        </div>
      </div>
    </article>
  );
}
import { useEffect } from 'react';
import {
    CheckIcon,
    CloseIcon,
    RefreshIcon,
    TruckIcon,
    WalletIcon,
    WarningIcon,
} from '../icons/NotificationIcons';
import type { NotificationData } from '../../../pages/Notificacoes/Notificacoes.types';
import styles from './NotificationDetailsModal.module.css';

interface NotificationDetailsModalProps {
    notification: NotificationData | null; // null = modal fechado
    onClose: () => void;
    onRenovar?: (id: string) => void;
    onPagar?: (id: string) => void;
}

const ICON_BY_TYPE = {
    success: CheckIcon,
    warning: WarningIcon,
    delivery: TruckIcon,
} as const;

interface DetailRow {
    label: string;
    value: string;
}

// Monta as linhas exibidas no modal de acordo com a categoria da notificação
function getDetailRows(notification: NotificationData): DetailRow[] {
    const { category, details } = notification;

    switch (category) {
        case 'reserva-confirmada':
            return [
                { label: 'Equipamento', value: details.equipamento ?? '-' },
                { label: 'Status', value: details.status ?? '-' },
                { label: 'Confirmado em', value: details.dataConfirmacao ?? '-' },
                { label: 'Período da locação', value: details.periodoLocacao ?? '-' },
                { label: 'Valor', value: details.valor ?? '-' },
                { label: 'Forma de pagamento', value: details.formaPagamento ?? '-' },
            ];

        case 'devolucao-pendente':
            return [
                { label: 'Equipamento', value: details.equipamento ?? '-' },
                { label: 'Status', value: details.status ?? '-' },
                { label: 'Data limite', value: details.dataLimite ?? '-' },
            ];

        case 'entrega-andamento':
            return [
                { label: 'Equipamento', value: details.equipamento ?? '-' },
                { label: 'Status da entrega', value: details.statusEntrega ?? '-' },
                { label: 'Previsão de chegada', value: details.previsaoChegada ?? '-' },
            ];

        case 'ferramenta-devolvida':
            return [
                { label: 'Equipamento', value: details.equipamento ?? '-' },
                { label: 'Status', value: details.status ?? '-' },
                { label: 'Devolvido em', value: details.dataDevolucao ?? '-' },
            ];

        case 'pagamento-pendente':
            return [
                { label: 'Equipamento', value: details.equipamento ?? '-' },
                { label: 'Status do pagamento', value: details.statusPagamento ?? '-' },
                { label: 'Valor', value: details.valor ?? '-' },
            ];

        default:
            return [];
    }
}

export default function NotificationDetailsModal({
    notification,
    onClose,
    onRenovar,
    onPagar,
}: NotificationDetailsModalProps) {
    // Fecha o modal ao pressionar Esc
    useEffect(() => {
        if (!notification) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') onClose();
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [notification, onClose]);

    if (!notification) return null; // nada selecionado, modal não renderiza

    const { id, type, category, title, description, showRenovar } = notification;
    const Icon = ICON_BY_TYPE[type];
    const rows = getDetailRows(notification);

    // Botões de ação variam conforme a categoria
    const showRenovarButton = category === 'devolucao-pendente' && showRenovar;
    const showPagarButton = category === 'pagamento-pendente';

    const handleRenovar = () => {
        onRenovar?.(id);
        onClose();
    };

    const handlePagar = () => {
        onPagar?.(id);
        onClose();
    };

    return (
        // Clique no overlay fecha o modal; stopPropagation evita fechar ao clicar dentro dele
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="notification-modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className={styles.header}>
                    <span className={`${styles.iconWrapper} ${styles[`icon_${type}`]}`}>
                        <Icon />
                    </span>

                    <div className={styles.headerText}>
                        <h2 id="notification-modal-title" className={styles.title}>
                            {title}
                        </h2>
                        <p className={styles.description}>{description}</p>
                    </div>

                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className={styles.details}>
                    {rows.map((row) => (
                        <div className={styles.row} key={row.label}>
                            <span className={styles.label}>{row.label}</span>
                            <span className={styles.value}>{row.value}</span>
                        </div>
                    ))}
                </div>

                {(showRenovarButton || showPagarButton) && (
                    <div className={styles.footer}>
                        {showRenovarButton && (
                            <button type="button" className={styles.renovarButton} onClick={handleRenovar}>
                                <RefreshIcon />
                                Renovar locação
                            </button>
                        )}
                        {showPagarButton && (
                            <button type="button" className={styles.pagarButton} onClick={handlePagar}>
                                <WalletIcon />
                                Pagar agora
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
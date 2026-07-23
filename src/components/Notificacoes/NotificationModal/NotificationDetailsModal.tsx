import { useEffect } from 'react';
import {
    AlertTriangle,
    BadgePercent,
    BellRing,
    CheckCircle2,
    CreditCard,
    Eye,
    Info,
    MessageSquare,
    RefreshCw,
    Star,
    Tag,
    Truck,
    X,
    XCircle,
    type LucideIcon,
} from 'lucide-react';
import { STATUS_CONFIG } from '../../MinhasReservas/EtiquetaStatus/statusConfig';
import type {
    NotificationCategory,
    NotificationData,
} from '../../../pages/Notificacoes/Notificacoes.types';
import styles from './NotificationDetailsModal.module.css';

interface NotificationDetailsModalProps {
    notification: NotificationData | null; // null = modal fechado
    onClose: () => void;
    onRenovar?: (id: string) => void;
    /** Leva o usuário até 'Detalhes da Reserva' com a reserva já selecionada
     * (usado para "Ver locação", "Efetuar pagamento", "Tentar pagamento novamente" etc). */
    onVerReserva?: (reservaId: string) => void;
    /** Leva o usuário até o fluxo de avaliação da locação finalizada. */
    onAvaliar?: (reservaId: string) => void;
    /** Leva o usuário até a busca de ferramentas (notificações de promoção). */
    onVerOfertas?: () => void;
}

// Ícone/cor genéricos por `type`, usados apenas quando a notificação não está atrelada
// a uma reserva (ex: promoção, nova mensagem, pagamento recusado). Notificações de
// reservas/locações usam o mesmo ícone/cor de STATUS_CONFIG (EtiquetaStatus).
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

        case 'reserva-cancelada':
            return [
                { label: 'Equipamento', value: details.equipamento ?? '-' },
                { label: 'Motivo', value: details.motivoCancelamento ?? '-' },
                { label: 'Cancelado em', value: details.dataCancelamento ?? '-' },
                { label: 'Valor reembolsado', value: details.valorReembolso ?? '-' },
            ];

        case 'devolucao-atrasada':
            return [
                { label: 'Equipamento', value: details.equipamento ?? '-' },
                { label: 'Data limite', value: details.dataLimite ?? '-' },
                { label: 'Dias em atraso', value: details.diasAtraso ?? '-' },
                { label: 'Multa', value: details.multa ?? '-' },
            ];

        case 'entrega-concluida':
            return [
                { label: 'Equipamento', value: details.equipamento ?? '-' },
                { label: 'Entregue em', value: details.dataEntrega ?? '-' },
                { label: 'Recebido por', value: details.recebidoPor ?? '-' },
            ];

        case 'pagamento-confirmado':
            return [
                { label: 'Valor', value: details.valor ?? '-' },
                { label: 'Forma de pagamento', value: details.formaPagamento ?? '-' },
                { label: 'Confirmado em', value: details.dataConfirmacao ?? '-' },
            ];

        case 'pagamento-recusado':
            return [
                { label: 'Valor', value: details.valor ?? '-' },
                { label: 'Forma de pagamento', value: details.formaPagamento ?? '-' },
                { label: 'Motivo da recusa', value: details.motivoRecusa ?? '-' },
            ];

        case 'promocao-disponivel':
            return [
                { label: 'Categoria', value: details.categoriaEquipamento ?? '-' },
                { label: 'Cupom', value: details.cupom ?? '-' },
                { label: 'Desconto', value: details.desconto ?? '-' },
                { label: 'Válido até', value: details.validade ?? '-' },
            ];

        case 'avaliacao-pendente':
            return [
                { label: 'Equipamento', value: details.equipamento ?? '-' },
                { label: 'Devolvido em', value: details.dataDevolucao ?? '-' },
                { label: 'Nota sugerida', value: details.notaSugerida ?? '-' },
            ];

        case 'nova-mensagem':
            return [
                { label: 'De', value: details.remetente ?? '-' },
                { label: 'Assunto', value: details.assunto ?? '-' },
                { label: 'Mensagem', value: details.mensagem ?? '-' },
            ];
        default:
            return [];
    }
}

type AlvoAcao = 'reserva' | 'avaliacao' | 'ofertas';

interface AcaoConfig {
    label: string;
    Icon: LucideIcon;
    alvo: AlvoAcao;
}

// Define o botão de ação principal do modal de acordo com a categoria da notificação,
// levando o usuário para o próximo passo natural daquele fluxo (pagamento, avaliação,
// detalhes da locação, etc).
function getAcaoConfig(category: NotificationCategory): AcaoConfig | null {
    switch (category) {
        case 'reserva-confirmada':
        case 'entrega-andamento':
        case 'entrega-concluida':
        case 'devolucao-pendente':
        case 'devolucao-atrasada':
        case 'ferramenta-devolvida':
        case 'pagamento-confirmado':
            return { label: 'Ver locação', Icon: Eye, alvo: 'reserva' };

        case 'reserva-cancelada':
            return { label: 'Ver detalhes', Icon: Eye, alvo: 'reserva' };

        case 'pagamento-pendente':
            return { label: 'Efetuar pagamento', Icon: CreditCard, alvo: 'reserva' };

        case 'pagamento-recusado':
            return { label: 'Tentar pagamento novamente', Icon: CreditCard, alvo: 'reserva' };

        case 'avaliacao-pendente':
            return { label: 'Avaliar locação', Icon: Star, alvo: 'avaliacao' };

        case 'promocao-disponivel':
            return { label: 'Ver ofertas', Icon: Tag, alvo: 'ofertas' };

        case 'nova-mensagem':
        default:
            return null;
    }
}

export default function NotificationDetailsModal({
    notification,
    onClose,
    onRenovar,
    onVerReserva,
    onAvaliar,
    onVerOfertas,
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

    const { id, type, category, title, description, showRenovar, statusReserva, reservaId } =
        notification;

    // Quando a notificação está atrelada a uma reserva, usa o mesmo ícone/cor de
    // STATUS_CONFIG (o mesmo exibido em 'Minhas Reservas'); caso contrário, cai no
    // ícone genérico baseado em `type`.
    const configStatus = statusReserva ? STATUS_CONFIG[statusReserva] : null;
    const Icon = configStatus ? configStatus.icon : ICON_BY_TYPE[type];
    const iconStyle = configStatus
        ? ({ background: configStatus.fundo, color: configStatus.cor } as React.CSSProperties)
        : undefined;

    const rows = getDetailRows(notification);

    // Botão "Renovar" continua exclusivo das categorias de devolução
    const showRenovarButton =
        (category === 'devolucao-pendente' || category === 'devolucao-atrasada') && showRenovar;

    // Botão de ação contextual (avaliação, pagamento, ver locação, ofertas...) de acordo
    // com a categoria da notificação. Só é exibido quando há para onde navegar.
    const acaoConfig = getAcaoConfig(category);
    const showAcaoButton =
        !!acaoConfig && (acaoConfig.alvo === 'ofertas' || !!reservaId);

    const handleRenovar = () => {
        onRenovar?.(id);
        onClose();
    };

    const handleAcao = () => {
        if (!acaoConfig) return;

        if (acaoConfig.alvo === 'reserva' && reservaId) {
            onVerReserva?.(reservaId);
        } else if (acaoConfig.alvo === 'avaliacao' && reservaId) {
            onAvaliar?.(reservaId);
        } else if (acaoConfig.alvo === 'ofertas') {
            onVerOfertas?.();
        }

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
                    <span
                        className={`${styles.iconWrapper} ${configStatus ? '' : styles[`icon_${type}`]}`}
                        style={iconStyle}
                    >
                        <Icon size={20} strokeWidth={2.25} />
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
                        <X size={18} />
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

                {(showRenovarButton || showAcaoButton) && (
                    <div className={styles.footer}>
                        {showRenovarButton && (
                            <button type="button" className={styles.renovarButton} onClick={handleRenovar}>
                                <RefreshCw size={14} />
                                Renovar locação
                            </button>
                        )}
                        {showAcaoButton && acaoConfig && (
                            <button type="button" className={styles.acaoButton} onClick={handleAcao}>
                                <acaoConfig.Icon size={14} />
                                {acaoConfig.label}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

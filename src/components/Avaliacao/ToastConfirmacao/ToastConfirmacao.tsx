import styles from './ToastConfirmacao.module.css';

interface ToastConfirmacaoProps {
    visivel: boolean;
    mensagem?: string;
}

/** Notificação flutuante de sucesso, some sozinha após alguns segundos. */
export function ToastConfirmacao({
    visivel,
    mensagem = 'Avaliação enviada com sucesso!',
}: ToastConfirmacaoProps) {
    return (
        <div
            className={`${styles.toast} ${visivel ? styles.show : ''}`}
            role="status"
            aria-live="polite"
        >
            {mensagem}
        </div>
    );
}
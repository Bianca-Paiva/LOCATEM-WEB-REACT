import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  /** Controla a exibição do modal. Quando `false`, nada é renderizado. */
  open: boolean;
  /** Título exibido no cabeçalho do modal. */
  title: string;
  /** Texto (ou conteúdo) explicando a ação que está prestes a ser confirmada. */
  message: ReactNode;
  /** Rótulo do botão de confirmação. Padrão: "Confirmar". */
  confirmLabel?: string;
  /** Rótulo do botão de cancelamento. Padrão: "Cancelar". */
  cancelLabel?: string;
  /** Executa a ação que estava pendente de confirmação. */
  onConfirm: () => void;
  /** Fecha o modal sem executar nenhuma ação (clique em Cancelar, no "X", no overlay ou tecla Esc). */
  onCancel: () => void;
  /**
   * "perigo" estiliza o botão de confirmação como uma ação destrutiva (vermelho) — usado em exclusões e cancelamentos. "padrao" usa a cor primária da marca. Padrão: "perigo".
   */
  variant?: 'perigo' | 'padrao';
}

/**
 * Modal de confirmação genérico e reutilizável. Usado sempre que uma ação (cancelar, excluir, sair da conta etc.) precisa de uma confirmação explícita do usuário antes de ser executada.
 * Todo o conteúdo (título, mensagem, textos dos botões e callbacks) vem por props — este componente não conhece a ação específica que está confirmando.
 */
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'perigo',
}: ConfirmModalProps) {
  // Fecha com a tecla Esc — mesmo padrão já usado em SolicitarLocacaoModal.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-titulo"
        aria-describedby="confirm-modal-mensagem"
      >
        <div className={styles.cabecalho}>
          <div className={styles.tituloWrapper}>
            {variant === 'perigo' && (
              <span className={styles.iconePerigo} aria-hidden="true">
                <AlertTriangle size={20} />
              </span>
            )}
            <h2 className={styles.titulo} id="confirm-modal-titulo">
              {title}
            </h2>
          </div>
          <button type="button" className={styles.btnFechar} onClick={onCancel} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className={styles.mensagem} id="confirm-modal-mensagem">
          {message}
        </div>

        <div className={styles.acoes}>
          <button type="button" className={styles.botaoSecundario} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={variant === 'perigo' ? styles.botaoPerigo : styles.botaoPrimario}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

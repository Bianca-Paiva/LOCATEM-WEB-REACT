import { AlertTriangle } from 'lucide-react';
import styles from './RemoverFerramentaModal.module.css';

interface RemoverFerramentaModalProps {
  open: boolean;
  nomeFerramenta: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/** Confirmação antes de remover uma ferramenta — mesmo padrão visual (overlay + card central) do SuccessModal. */
export default function RemoverFerramentaModal({
  open,
  nomeFerramenta,
  onConfirmar,
  onCancelar,
}: RemoverFerramentaModalProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}>
          <AlertTriangle size={30} color="white" strokeWidth={2.4} />
        </div>

        <h2 className={styles.title}>Remover ferramenta?</h2>

        <p className={styles.message}>
          Tem certeza que deseja remover <strong>{nomeFerramenta}</strong> do seu catálogo? Essa ação não pode ser
          desfeita.
        </p>

        <div className={styles.acoes}>
          <button type="button" className={styles.botaoCancelar} onClick={onCancelar}>
            Cancelar
          </button>
          <button type="button" className={styles.botaoConfirmar} onClick={onConfirmar}>
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}

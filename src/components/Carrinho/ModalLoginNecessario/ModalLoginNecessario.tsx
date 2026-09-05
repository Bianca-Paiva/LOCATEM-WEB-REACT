import { X } from 'lucide-react';
import BtnPrincipal from '../../BtnPrincipal/BtnPrincipal';
import styles from './ModalLoginNecessario.module.css';

interface ModalLoginNecessarioProps {
  open: boolean;
  onClose: () => void;
  /** Usuário clicou em "Entrar na minha conta" — quem chama decide o que fazer (navegar para o Login). */
  onEntrar: () => void;
}

/**
 * Modal exibido quando um usuário deslogado clica em "Continuar para Pagamento" no
 * Carrinho. Segue o mesmo padrão visual (overlay + card) já usado em
 * components/Perfil/EditarPerfilModal.
 */
export default function ModalLoginNecessario({ open, onClose, onEntrar }: ModalLoginNecessarioProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-login-necessario-titulo"
      >
        <div className={styles.cabecalho}>
          <h2 className={styles.titulo} id="modal-login-necessario-titulo">
            Login necessário
          </h2>
          <button type="button" className={styles.btnFechar} onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <p className={styles.mensagem}>
          Você precisa estar autenticado para efetuar o pagamento. Entre na sua conta para
          continuar com a compra — os itens do seu carrinho serão mantidos.
        </p>

        <BtnPrincipal text="Entrar na minha conta" onClick={onEntrar} />
      </div>
    </div>
  );
}

import styles from './HeaderPagamento.module.css';
import { MessageCircle } from 'lucide-react';

interface HeaderPagamentoProps {
  onChatClick?: () => void;
}

export function HeaderPagamento({ onChatClick }: HeaderPagamentoProps) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🏠</span>
        <span className={styles.logoText}>LOCATEM</span>
      </div>

      <button className={styles.chatBtn} onClick={onChatClick} aria-label="Abrir chat">
        <MessageCircle size={20} />
      </button>
    </header>
  );
}

import styles from './PageHeaderBack.module.css';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderBackProps { title: string; onBack?: () => void; }

export function PageHeaderBack({ title, onBack }: PageHeaderBackProps) {
  return (
    <div className={styles.wrapper}>
      <button className={styles.backBtn} type="button" onClick={onBack} aria-label="Voltar">
        <ArrowLeft size={20} aria-hidden="true" />
      </button>
      <h1 className={styles.titulo}>{title}</h1>
    </div>
  );
}

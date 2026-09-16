import { Plus } from 'lucide-react';
import styles from './HomeLocadorCardNovaFerramenta.module.css';

interface HomeLocadorCardNovaFerramentaProps {
  onClick: () => void;
}

/** Card "+ Cadastrar nova ferramenta" ao final da grade de "Minhas Ferramentas" da Home do Locador. */
export default function HomeLocadorCardNovaFerramenta({ onClick }: HomeLocadorCardNovaFerramentaProps) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <span className={styles.iconeWrapper}>
        <Plus size={22} strokeWidth={2} />
      </span>
      Cadastrar nova ferramenta
    </button>
  );
}

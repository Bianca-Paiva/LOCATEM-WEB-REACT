import { Check } from 'lucide-react';
import styles from './Acessorios.module.css';

interface AcessoriosProps {
  itens: string[];
}

export function Acessorios({ itens }: AcessoriosProps) {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.titulo}>Acessórios Inclusos</h2>
      <ul className={styles.lista}>
        {itens.map((item, i) => (
          <li key={i} className={styles.item}>
            <Check className={styles.icone} size={16} strokeWidth={2} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
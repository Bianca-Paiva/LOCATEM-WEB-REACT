import { Calendar } from 'lucide-react';
import styles from './EstadoVazio.module.css';

interface EstadoVazioProps {
  titulo: string;
  descricao: string;
}

export default function EstadoVazio({ titulo, descricao }: EstadoVazioProps) {
  return (
    <div className={styles.estadoVazio}>
      <Calendar className={styles.iconeVazio} aria-hidden="true" strokeWidth={1.5} />
      <p className={styles.tituloVazio}>{titulo}</p>
      <p className={styles.descricaoVazia}>{descricao}</p>
    </div>
  );
}
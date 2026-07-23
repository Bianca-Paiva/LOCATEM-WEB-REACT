import calendarioIcon from '../../../assets/iconCalendarioReservas.png';
import styles from './EstadoVazio.module.css';

interface EstadoVazioProps {
  titulo: string;
  descricao: string;
}

export default function EstadoVazio({ titulo, descricao }: EstadoVazioProps) {
  return (
    <div className={styles.estadoVazio}>
      <img src={calendarioIcon} alt="" className={styles.iconeVazio} />
      <p className={styles.tituloVazio}>{titulo}</p>
      <p className={styles.descricaoVazia}>{descricao}</p>
    </div>
  );
}

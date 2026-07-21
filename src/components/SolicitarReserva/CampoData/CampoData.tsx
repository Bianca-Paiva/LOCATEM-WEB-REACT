import calendarioIcon from '../../../assets/iconCalendarioReservas.png';
import styles from './CampoData.module.css';

interface CampoDataProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
}

export default function CampoData({ id, label, value, onChange, min }: CampoDataProps) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      <div className={styles.campoWrapper}>
        <input
          id={id}
          type="date"
          className={styles.input}
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
        />
        <img src={calendarioIcon} alt="" className={styles.icone} />
      </div>
    </div>
  );
}

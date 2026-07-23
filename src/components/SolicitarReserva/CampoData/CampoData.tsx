import calendarioIcon from '../../../assets/iconCalendarioReservas.png';
import styles from './CampoData.module.css';

interface CampoDataProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  required?: boolean;
  error?: string;
  shake?: boolean;
}

export default function CampoData({
  id,
  label,
  value,
  onChange,
  min,
  required = false,
  error,
  shake = false,
}: CampoDataProps) {
  return (
    <div className={`${styles.wrapper} ${shake ? styles.shake : ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>

      <div className={styles.campoWrapper}>
        <input
          id={id}
          type="date"
          className={`${styles.input} ${error ? styles.erro : ''}`}
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
        />
        <img src={calendarioIcon} alt="" className={styles.icone} />
      </div>
      {error && <small className={styles.error}>{error}</small>}
    </div>
  );
}
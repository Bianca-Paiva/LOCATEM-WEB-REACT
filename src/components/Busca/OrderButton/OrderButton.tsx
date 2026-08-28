import FormSelect from '../../Inputs/FormSelect/FormSelect';
import styles from './OrderButton.module.css';

interface Option {
  value: string;
  label: string;
}

interface ButtonOrderProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export function ButtonOrder({
  value,
  onChange,
  options,
}: ButtonOrderProps) {
  return (
    <div className={styles.buttonOrderContainer}>
      <label htmlFor="button-order-select" className={styles.sortLabel}>
        Ordenar por
      </label>

      <div className={styles.selectWrapper}>
        <FormSelect
          id="button-order-select"
          options={options}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
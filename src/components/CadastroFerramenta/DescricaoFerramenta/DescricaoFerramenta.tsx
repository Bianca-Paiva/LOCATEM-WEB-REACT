import styles from './DescricaoFerramenta.module.css';
import FormTextarea from '../../Inputs/FormTextarea/FormTextarea';

const LIMITE_CARACTERES = 1000;
const MIN_CARACTERES = 50;

interface DescricaoFerramentaProps {
  value: string;
  onChange: (valor: string) => void;
  error?: string;
  shake?: boolean;
}

export default function DescricaoFerramenta({
  value,
  onChange,
  error,
  shake
}: DescricaoFerramentaProps) {
  return (
    <div className={`${styles.wrapper} ${shake ? styles.shake : ''}`}>
      <FormTextarea
        id="descricao"
        label="Descrição da Ferramenta"
        required
        placeholder="Descreva a ferramenta, estado de uso, recomendações e observações importantes."
        value={value}
        minLength={MIN_CARACTERES}
        maxLength={LIMITE_CARACTERES}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        status={error ? 'erro' : ''}
        shake={shake}
      />

      <div className={styles.rodape}>
        <small className={styles.contador}>
          {value.length} / {LIMITE_CARACTERES}
        </small>
      </div>
    </div>
  );
}

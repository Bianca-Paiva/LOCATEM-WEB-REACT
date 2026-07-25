import styles from './DescricaoFerramenta.module.css';

const LIMITE_CARACTERES = 1000;
const MIN_CARACTERES = 50;

interface DescricaoFerramentaProps {
  value: string;
  onChange: (valor: string) => void;
  error?: string;
  shake?: boolean;
}

export default function DescricaoFerramenta({ value, onChange, error, shake }: DescricaoFerramentaProps) {
  return (
    <div className={`${styles.wrapper} ${shake ? styles.shake : ''}`}>
      <textarea
        id="descricao"
        className={`${styles.textarea} ${error ? styles.erro : ''}`}
        placeholder="Descreva seu equipamento, usos ideais, recomendações e outras informações importantes."
        value={value}
        minLength={MIN_CARACTERES}
        maxLength={LIMITE_CARACTERES}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className={styles.rodape}>
        {error ? <small className={styles.error}>{error}</small> : <span />}
        <span className={styles.contador}>
          {value.length} / {LIMITE_CARACTERES}
        </span>
      </div>
    </div>
  );
}

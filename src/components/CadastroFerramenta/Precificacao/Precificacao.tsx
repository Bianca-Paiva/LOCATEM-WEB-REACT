import styles from './Precificacao.module.css';
import FormInput from '../../Inputs/FormInput/FormInput';

interface PrecificacaoProps {
  valorDiaria: string;
  caucao: string;
  onChangeValorDiaria: (valor: string) => void;
  onChangeCaucao: (valor: string) => void;
  error?: string;
  shake?: boolean;
}

// Máscara simples de moeda: mantém apenas números e vírgula decimal.
function maskMoeda(valor: string): string {
  const limpo = valor.replace(/[^\d,]/g, '');
  const partes = limpo.split(',');

  if (partes.length <= 1) return limpo;

  return `${partes[0]},${partes.slice(1).join('').slice(0, 2)}`;
}

export default function Precificacao({
  valorDiaria,
  caucao,
  onChangeValorDiaria,
  onChangeCaucao,
  error,
  shake,
}: PrecificacaoProps) {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.campo} ${shake && error ? styles.shake : ''}`}>
        <label htmlFor="valorDiaria" className={styles.label}>
          Valor da Diária<span className={styles.obrigatorio}> *</span>
        </label>
        <div className={styles.inputMoeda}>
          <span className={styles.prefixo}>R$</span>
            <FormInput
              id="valorDiaria"
              type="text"
              inputMode="decimal"
              placeholder="Ex: 45,00"
              value={valorDiaria}
              onChange={(e) => onChangeValorDiaria(maskMoeda(e.target.value))}
              status={error ? 'erro' : ''}
              aria-label="Valor da diária"
            />
        </div>
        {error ? (
          <small className={styles.error}>{error}</small>
        ) : (
          <small className={styles.dica}>Valor cobrado por dia de locação.</small>
        )}
      </div>

      <div className={styles.campo}>
        <label htmlFor="caucao" className={styles.label}>Caução (opcional)</label>
        <div className={styles.inputMoeda}>
          <span className={styles.prefixo}>R$</span>
            <FormInput
              id="caucao"
              type="text"
              inputMode="decimal"
              placeholder="Ex: 200,00"
              value={caucao}
              onChange={(e) => onChangeCaucao(maskMoeda(e.target.value))}
              aria-label="Caução"
            />
        </div>
        <small className={styles.dica}>Valor devolvido após a devolução da ferramenta.</small>
      </div>
    </div>
  );
}

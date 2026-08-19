import styles from './SeletorQuantidade.module.css';

interface SeletorQuantidadeProps {
  quantidade: number;
  estoqueDisponivel?: number;
  exibirEstoqueDisponivel?: boolean;
  onDecrementar: () => void;
  onIncrementar: () => void;
}

export default function SeletorQuantidade({
  quantidade,
  estoqueDisponivel,
  exibirEstoqueDisponivel = true,
  onDecrementar,
  onIncrementar,
}: SeletorQuantidadeProps) {
  const limiteMaximo =
    exibirEstoqueDisponivel && estoqueDisponivel !== undefined
      ? estoqueDisponivel
      : 999;

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>
        Quantidade
        <span className={styles.required}> *</span>

        {exibirEstoqueDisponivel && estoqueDisponivel !== undefined && (
          <span className={styles.estoque}>
            ({estoqueDisponivel}{' '}
            {estoqueDisponivel === 1
              ? 'disponível'
              : 'disponíveis'})
          </span>
        )}
      </p>

      <div className={styles.linha}>
        <div className={styles.controle}>
          <button
            type="button"
            className={styles.botao}
            onClick={onDecrementar}
            disabled={quantidade <= 1}
            aria-label="Diminuir quantidade"
          >
            −
          </button>

          <span className={styles.valor}>{quantidade}</span>

          <button
            type="button"
            className={styles.botao}
            onClick={onIncrementar}
            disabled={
              estoqueDisponivel !== undefined
                ? quantidade >= estoqueDisponivel
                : quantidade >= 999
            }
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
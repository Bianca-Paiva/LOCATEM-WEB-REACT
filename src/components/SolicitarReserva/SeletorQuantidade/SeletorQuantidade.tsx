import styles from './SeletorQuantidade.module.css';

interface SeletorQuantidadeProps {
  quantidade: number;
  estoqueDisponivel: number;
  onDecrementar: () => void;
  onIncrementar: () => void;
}

export default function SeletorQuantidade({
  quantidade,
  estoqueDisponivel,
  onDecrementar,
  onIncrementar,
}: SeletorQuantidadeProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>
        Quantidade
        <span className={styles.required}> *</span>
        <span className={styles.estoque}>
          ({estoqueDisponivel} {estoqueDisponivel === 1 ? 'disponível' : 'disponíveis'})
        </span>
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
            disabled={quantidade >= estoqueDisponivel}
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
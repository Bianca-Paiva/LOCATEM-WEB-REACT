import styles from './Abas.module.css';

export interface AbaItem<T extends string> {
  key: T;
  label: string;
}

interface AbasProps<T extends string> {
  abas: AbaItem<T>[];
  ativo: T;
  onChange: (valor: T) => void;
  contagem: Record<T, number>;
}

/**
 * Barra de abas de filtro com contador (ex: "Todas (18)", "Disponíveis (9)").
 * Mesmo padrão visual de components/MinhasLocacoes/LocacaoAbas, generalizado para
 * qualquer conjunto de chaves — usado em Minhas Ferramentas, Gerenciar Locações e
 * Histórico de Locações.
 */
export default function Abas<T extends string>({ abas, ativo, onChange, contagem }: AbasProps<T>) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.rolagemAbas}>
        {abas.map((aba) => {
          const ativa = aba.key === ativo;
          return (
            <button
              key={aba.key}
              type="button"
              className={`${styles.aba} ${ativa ? styles.abaAtiva : ''}`}
              onClick={() => onChange(aba.key)}
              aria-pressed={ativa}
            >
              {aba.label}
              <span className={`${styles.contador} ${ativa ? styles.contadorAtivo : ''}`}>
                {contagem[aba.key]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

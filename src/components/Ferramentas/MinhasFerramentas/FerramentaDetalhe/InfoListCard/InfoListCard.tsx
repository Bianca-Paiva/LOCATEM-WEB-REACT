import styles from './InfoListCard.module.css';

export interface InfoListRow {
  label: string;
  valor: string;
  /** Destaca o valor (cor primária), usado para o dado mais importante do card. */
  destaque?: boolean;
}

interface InfoListCardProps {
  titulo: string;
  linhas: InfoListRow[];
}

/** Card branco simples com título e uma lista de pares label/valor — mesmo padrão visual de SecaoCard/LocacaoResumoCard. */
export default function InfoListCard({ titulo, linhas }: InfoListCardProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.titulo}>{titulo}</h2>
      <div className={styles.lista}>
        {linhas.map((linha) => (
          <div key={linha.label} className={styles.linha}>
            <span className={styles.label}>{linha.label}</span>
            <span className={`${styles.valor} ${linha.destaque ? styles.valorDestaque : ''}`}>{linha.valor}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

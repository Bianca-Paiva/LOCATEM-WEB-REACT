import styles from './EspecificacoesTecnicas.module.css';

interface Especificacao {
  label: string;
  valor: string;
}

interface EspecificacoesTecnicasProps {
  especificacoes: Especificacao[];
}

export function EspecificacoesTecnicas({ especificacoes }: EspecificacoesTecnicasProps) {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.titulo}>Especificações Técnicas</h2>
      <div className={styles.tabela}>
        {especificacoes.map((esp, i) => (
          <div key={i} className={`${styles.linha} ${i % 2 === 0 ? styles.linhaClara : styles.linhaEscura}`}>
            <span className={styles.label}>{esp.label}</span>
            <span className={styles.valor}>{esp.valor}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
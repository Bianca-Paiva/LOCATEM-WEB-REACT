import styles from './EspecificacoesTecnicas.module.css';

interface Especificacao {
  label: string;
  valor: string;
}

interface EspecificacoesTecnicasProps {
  especificacoes: Especificacao[];
  titulo?: string;
}

export function EspecificacoesTecnicas({ especificacoes, titulo = 'Especificações Técnicas' }: EspecificacoesTecnicasProps) {
  return (
    <section className={styles.wrapper}>
      <h2 className={styles.titulo}>{titulo}</h2>
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
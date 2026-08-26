import styles from './CompletarPerfil.module.css';

interface CompletarPerfilProps {
  percentual: number;
  mensagemDica: string;
}

/** Card "Complete seu Perfil" — barra e texto refletem o percentual calculado em useCompletudePerfil. */
export default function CompletarPerfil({ percentual, mensagemDica }: CompletarPerfilProps) {
  return (
    <section className={styles.card}>
      <div className={styles.linhaTitulo}>
        <h2 className={styles.titulo}>Complete seu Perfil</h2>
        <span className={styles.percentual}>{percentual}% concluído</span>
      </div>

      <div className={styles.barraFundo} role="progressbar" aria-valuenow={percentual} aria-valuemin={0} aria-valuemax={100}>
        <div className={styles.barraPreenchida} style={{ width: `${percentual}%` }} />
      </div>

      <p className={styles.dica}>{mensagemDica}</p>
    </section>
  );
}

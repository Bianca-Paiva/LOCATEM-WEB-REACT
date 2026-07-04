import styles from './Descricao.module.css';

interface DescricaoProps {
  texto: string;
}

export function Descricao({ texto }: DescricaoProps) {
  return (
    <section className={styles.descricaoWrapper}>
      <h2 className={styles.titulo}>Descrição</h2>
      <p className={styles.texto}>{texto}</p>
    </section>
  );
}
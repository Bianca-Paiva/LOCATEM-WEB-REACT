import type { ReactNode } from 'react';
import styles from './SecaoCard.module.css';

interface SecaoCardProps {
  /** Ícone exibido no badge, à esquerda do título (ex: <Icon icon="mdi:camera-outline" />). */
  icone: ReactNode;
  /** Título da seção (ex: "Fotos da Ferramenta"). */
  titulo: string;
  /** Se true, exibe o asterisco vermelho de campo obrigatório ao lado do título. */
  obrigatorio?: boolean;
  /** Texto de apoio abaixo do título. */
  subtitulo: string;
  /** Conteúdo da seção (campos do formulário). */
  children: ReactNode;
  /** Classe extra, usada para variações pontuais (ex: espaçamento). */
  className?: string;
}

export default function SecaoCard({
  icone,
  titulo,
  obrigatorio = false,
  subtitulo,
  children,
  className,
}: SecaoCardProps) {
  return (
    <section className={`${styles.card}${className ? ` ${className}` : ''}`}>
      <header className={styles.cabecalho}>
        <div className={styles.iconeBadge}>{icone}</div>
        <div className={styles.textos}>
          <h2 className={styles.titulo}>
            {titulo}
            {obrigatorio && <span className={styles.obrigatorio}> *</span>}
          </h2>
          <p className={styles.subtitulo}>{subtitulo}</p>
        </div>
      </header>

      <div className={styles.conteudo}>{children}</div>
    </section>
  );
}

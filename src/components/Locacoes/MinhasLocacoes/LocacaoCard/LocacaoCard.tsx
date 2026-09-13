import type { LocacaoData } from '../../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import StatusBadge from '../EtiquetaStatus/EtiquetaStatus';
import { Calendar, User } from 'lucide-react';
import styles from './LocacaoCard.module.css';

interface LocacaoCardProps {
  locacao: LocacaoData;
  onVerDetalhes?: (id: string) => void;
}

export default function LocacaoCard({ locacao, onVerDetalhes }: LocacaoCardProps) {
  const { id, produto, imagem, periodo, locador, status, mensagemStatus } = locacao;

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.cardButton}
        onClick={() => onVerDetalhes?.(id)}
      >
        <div className={styles.miniatura}>
          <img src={imagem} alt={produto} />
        </div>

        <div className={styles.conteudo}>
          <h3 className={styles.titulo}>{produto}</h3>

          <div className={styles.linhaInformacoes}>
            <span className={styles.itemInformacao}>
              <Calendar className={styles.iconeInformacao} aria-hidden="true" strokeWidth={2} />
              {periodo}
            </span>

            <span className={styles.itemInformacao}>
              <User className={styles.iconeInformacao} aria-hidden="true" strokeWidth={2} />
              Locador: {locador}
            </span>
          </div>

          <p className={styles.mensagemStatus}>{mensagemStatus}</p>
        </div>

        <div className={styles.aside}>
          <StatusBadge status={status} />
          <span className={styles.seta} aria-hidden="true" />
        </div>
      </button>
    </article>
  );
}
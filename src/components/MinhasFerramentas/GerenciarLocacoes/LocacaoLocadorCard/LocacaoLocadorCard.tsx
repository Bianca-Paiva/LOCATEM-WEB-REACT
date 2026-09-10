import type { LocacaoData } from '../../../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import StatusBadge from '../../../MinhasLocacoes/EtiquetaStatus/EtiquetaStatus';
import { Calendar, User } from 'lucide-react';
import styles from './LocacaoLocadorCard.module.css';

interface LocacaoLocadorCardProps {
  locacao: LocacaoData;
  onClick?: (locacao: LocacaoData) => void;
}

export default function LocacaoLocadorCard({ locacao, onClick }: LocacaoLocadorCardProps) {
  const { produto, imagem, periodo, locatario, status, mensagemStatus, valor } = locacao;

  return (
    <article className={styles.card}>
      <button type="button" className={styles.cardButton} onClick={() => onClick?.(locacao)}>
        <div className={styles.miniatura}>
          <img src={imagem} alt={produto} />
        </div>

        <div className={styles.conteudo}>
          <h3 className={styles.titulo}>{produto}</h3>

          <div className={styles.linhaInformacoes}>
            <span className={styles.itemInformacao}>
              <User className={styles.iconeInformacao} aria-hidden="true" strokeWidth={2} />
              {locatario}
            </span>

            <span className={styles.itemInformacao}>
              <Calendar className={styles.iconeInformacao} aria-hidden="true" strokeWidth={2} />
              {periodo}
            </span>
          </div>

          <p className={styles.mensagemStatus}>{mensagemStatus}</p>
        </div>

        <div className={styles.aside}>
          <StatusBadge status={status} />
          <span className={styles.valor}>{valor}</span>
        </div>
      </button>
    </article>
  );
}

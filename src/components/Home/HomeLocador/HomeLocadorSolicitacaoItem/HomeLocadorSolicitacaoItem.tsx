import { Calendar, ChevronRight } from 'lucide-react';
import EtiquetaStatus from '../../../Locacoes/MinhasLocacoes/EtiquetaStatus/EtiquetaStatus';
import type { SolicitacaoRecenteLocador } from '../../../../pages/Home/HomeLocador/HomeLocador.types';
import styles from './HomeLocadorSolicitacaoItem.module.css';

interface HomeLocadorSolicitacaoItemProps {
  solicitacao: SolicitacaoRecenteLocador;
  onVerDetalhes: () => void;
}

export default function HomeLocadorSolicitacaoItem({ solicitacao, onVerDetalhes }: HomeLocadorSolicitacaoItemProps) {
  return (
    <li className={styles.item}>
      
      {/* Linha 1: Foto e Informações */}
      <div className={styles.linhaPrincipal}>
        <img src={solicitacao.imagem} alt={solicitacao.produto} className={styles.imagem} />
        <div className={styles.info}>
          <p className={styles.ferramenta}>{solicitacao.produto}</p>
          <p className={styles.locatario}>Solicitado por {solicitacao.locatario}</p>
        </div>
      </div>

      {/* Linha 2: Badge de Status e Botão */}
      <div className={styles.linhaAcoes}>
        <EtiquetaStatus status={solicitacao.status} />
        <button type="button" className={styles.botaoVerDetalhes} onClick={onVerDetalhes}>
          Ver detalhes
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Linha 3: Ícone de Calendário e Datas */}
      <div className={styles.periodo}>
        <Calendar size={14} strokeWidth={2} aria-hidden="true" />
        <span>{solicitacao.periodo}</span>
      </div>

    </li>
  );
}
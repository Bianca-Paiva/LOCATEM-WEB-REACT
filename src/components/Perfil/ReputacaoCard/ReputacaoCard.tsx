import type { CSSProperties } from 'react';
import { EstrelasAvaliacao } from '../../Avaliacao/EstrelaAvaliacao/EstrelaAvaliacao';
import type { ReputacaoUsuario, TipoUsuario } from '../../../types/usuario.types';
import styles from './ReputacaoCard.module.css';

interface ReputacaoCardProps {
  reputacao: ReputacaoUsuario;
  tipo: TipoUsuario;
  onVerAvaliacoes: () => void;
}

/**
 * Card "Reputação". A lista de métricas muda conforme o tipo de usuário: Locador
 * mostra "entregas no prazo" (indicador do protótipo de Locador), Locatário não.
 */
export default function ReputacaoCard({ reputacao, tipo, onVerAvaliacoes }: ReputacaoCardProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.titulo}>Reputação</h2>

      <div className={styles.notaBloco}>
        <span className={styles.nota}>{reputacao.rating.toFixed(1)}</span>
        {/* --star-active sobrescreve o azul padrão do componente pelo amarelo da marca (ver protótipo) */}
        <div style={{ '--star-active': '#F9C01A' } as CSSProperties}>
          <EstrelasAvaliacao notaAtual={reputacao.rating} variante="lista" descricaoContexto="reputação do usuário" />
        </div>
      </div>

      <div className={styles.metricas}>
        <p className={styles.baseadoEm}>Baseado em</p>
        <p className={styles.metrica}>{reputacao.totalAvaliacoes} avaliações</p>
        <p className={styles.metrica}>
          {reputacao.locacoesConcluidas} {tipo === 'locador' ? 'locações concluídas' : 'locações'}
        </p>
        {tipo === 'locador' && reputacao.entregasNoPrazoPercentual !== undefined && (
          <p className={styles.metrica}>{reputacao.entregasNoPrazoPercentual}% entregas no prazo</p>
        )}
      </div>

      <button type="button" className={styles.btnVerAvaliacoes} onClick={onVerAvaliacoes}>
        Ver avaliações
      </button>
    </section>
  );
}

import type { StatusReserva } from '../../../pages/Reservas/MinhasReservas/MinhasReservas.types';
import styles from './AcoesReserva.module.css';

interface AcoesReservaProps {
  status: StatusReserva;
  onCancelarSolicitacao?: () => void;
  onVerLocacoes?: () => void;
  onProsseguirAluguel?: () => void;
  onVoltarReservas?: () => void;
  onSolicitarNovaReserva?: () => void;
}

export default function AcoesReserva({
  status,
  onCancelarSolicitacao,
  onVerLocacoes,
  onProsseguirAluguel,
  onVoltarReservas,
  onSolicitarNovaReserva,
}: AcoesReservaProps) {
  if (status === 'pendente') {
    return (
      <button
        type="button"
        className={styles.botaoPerigo}
        onClick={onCancelarSolicitacao}
      >
        Cancelar solicitação
      </button>
    );
  }

  if (status === 'aprovada') {
    return (
      <div className={styles.grupoBotoes}>
        <button type="button" className={styles.botaoSecundario} onClick={onVerLocacoes}>
          Ver minhas locações
        </button>
        <button type="button" className={styles.botaoPrimario} onClick={onProsseguirAluguel}>
          Prosseguir para aluguel
        </button>
      </div>
    );
  }

  // recusada e cancelada compartilham o mesmo par de ações
  return (
    <div className={styles.grupoBotoes}>
      <button type="button" className={styles.botaoSecundario} onClick={onVoltarReservas}>
        Voltar para minhas reservas
      </button>
      <button type="button" className={styles.botaoPrimario} onClick={onSolicitarNovaReserva}>
        Solicitar nova reserva
      </button>
    </div>
  );
}

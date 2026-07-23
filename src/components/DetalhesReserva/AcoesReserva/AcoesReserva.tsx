import type { StatusReserva } from '../../../pages/Reservas/MinhasReservas/MinhasReservas.types';
import styles from './AcoesReserva.module.css';

interface AcoesReservaProps {
  status: StatusReserva;
  onCancelarSolicitacao?: () => void;
  onVerLocacoes?: () => void;
  onAvaliacao?: () => void;
  onProsseguirAluguel?: () => void;
  onVoltarReservas?: () => void;
  onSolicitarNovaReserva?: () => void;
}

export default function AcoesReserva({
  status,
  onCancelarSolicitacao,
  onVerLocacoes,
  onAvaliacao,
  onProsseguirAluguel,
  onVoltarReservas,
  onSolicitarNovaReserva,
}: AcoesReservaProps) {
  // Aguardando aprovação: única ação possível é cancelar a solicitação
  if (status === 'pendente') {
    return (
      <div className={styles.grupoBotoes}>
        <button
          type="button"
          className={styles.botaoSecundario}
          onClick={onVoltarReservas}
        >
          Voltar para minhas reservas
        </button>

        <button
          type="button"
          className={styles.botaoPerigo}
          onClick={onCancelarSolicitacao}
        >
          Cancelar solicitação
        </button>
      </div>
    );
  }

  // Aguardando pagamento: reserva aceita pelo locador, falta efetuar o pagamento
  if (status === 'aguardandoPagamento') {
    return (
      <div className={styles.grupoBotoes}>
        <button
          type="button"
          className={styles.botaoSecundario}
          onClick={onVerLocacoes}
        >
          Ver minhas locações
        </button>
        <button
          type="button"
          className={styles.botaoPrimario}
          onClick={onProsseguirAluguel}
        >
          Efetuar pagamento
        </button>
      </div>
    );
  }

  // Preparando entrega, em transporte, em andamento, aguardando devolução e devolução em
  // transporte: a reserva já está em curso, o usuário só acompanha o status
  if (
    status === 'preparandoEntrega' ||
    status === 'emTransporte' ||
    status === 'emAndamento' ||
    status === 'aguardandoDevolucao' ||
    status === 'devolucaoEmTransporte'
  ) {
    return (
      <button type="button" className={styles.botaoSecundario} onClick={onVerLocacoes}>
        Ver minhas locações
      </button>
    );
  }

  if (
    status === 'finalizada'
  ) {
    return (
      <div className={styles.grupoBotoes}>
        <button type="button" className={styles.botaoSecundario} onClick={onVoltarReservas}>
          Voltar para minhas reservas
        </button>
        <button type="button" className={styles.botaoPrimario} onClick={onAvaliacao}>
          Avaliar Locação
        </button>
      </div>
    );
  }

  // Recusada e cancelada compartilham o mesmo par de ações
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
import type { StatusLocacao } from '../../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import BtnPrincipal from '../../BtnPrincipal/BtnPrincipal';
import BtnSecundario from '../../BtnSecundario/BtnSecundario';
import styles from './AcoesLocacao.module.css';

interface AcoesLocacaoProps {
  status: StatusLocacao;
  onCancelarSolicitacao?: () => void;
  onVerLocacoes?: () => void;
  onAvaliacao?: () => void;
  onProsseguirAluguel?: () => void;
  onVoltarLocacoes?: () => void;
  onSolicitarNovaLocacao?: () => void;
}

export default function AcoesLocacao({
  status,
  onCancelarSolicitacao,
  onVerLocacoes,
  onAvaliacao,
  onProsseguirAluguel,
  onVoltarLocacoes,
  onSolicitarNovaLocacao,
}: AcoesLocacaoProps) {

  // Aguardando aprovação: única ação possível é cancelar a solicitação
  if (status === 'pendente') {
    return (
      <div className={styles.grupoBotoes}>
        <BtnSecundario 
          text="Voltar para Minhas Locações" 
          onClick={onVoltarLocacoes} 
          type="button" 
        />

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

  // Aguardando pagamento: locacao aceita pelo locador, falta efetuar o pagamento
  if (status === 'aguardandoPagamento') {
    return (
      <div className={styles.grupoBotoes}>
        <BtnSecundario 
          text="Ver minhas locações" 
          onClick={onVerLocacoes} 
          type="button" 
        />

        <BtnPrincipal 
          text="Efetuar pagamento" 
          onClick={onProsseguirAluguel} 
          type="button" 
        />
      </div>
    );
  }

  // Preparando entrega, em transporte, em andamento, aguardando devolução e devolução em
  // transporte: a locacao já está em curso, o usuário só acompanha o status
  if (
    status === 'preparandoEntrega' ||
    status === 'emTransporte' ||
    status === 'emAndamento' ||
    status === 'aguardandoDevolucao' ||
    status === 'devolucaoEmTransporte'
  ) {
    return (
      <BtnSecundario 
        text="Ver minhas locações" 
        onClick={onVerLocacoes} 
        type="button" 
      />
    );
  }

  if (
    status === 'finalizada'
  ) {
    return (
      <div className={styles.grupoBotoes}>
        <BtnSecundario 
          text="Voltar para minhas locações" 
          onClick={onVoltarLocacoes} 
          type="button" 
        />

        <BtnPrincipal 
          text="Avaliar Locação" 
          onClick={onAvaliacao} 
          type="button" 
        />
      </div>
    );
  }

  // Recusada e cancelada compartilham o mesmo par de ações
  return (
    <div className={styles.grupoBotoes}>
      <BtnSecundario 
        text="Voltar para Minhas Locações" 
        onClick={onVoltarLocacoes} 
        type="button" 
      />

      <BtnPrincipal 
        text="Solicitar nova locação" 
        onClick={onSolicitarNovaLocacao} 
        type="button" 
      />
    </div>
  );
}
import type { StatusReserva } from '../../../pages/Reservas/MinhasReservas/MinhasReservas.types';
import styles from './PainelStatusReserva.module.css';

interface PainelStatusReservaProps {
  status: StatusReserva;
  /** Usado apenas quando status === 'recusada' */
  motivoRecusa?: string;
}

// Textos padrão exibidos em cada estado da reserva
const CONTEUDO_POR_STATUS: Record<
  StatusReserva,
  { titulo: string; mensagem: string; simbolo: string }
> = {
  pendente: {
    titulo: 'Sua solicitação está pendente.',
    mensagem: 'O locador tem até 24h para analisar e responder.',
    simbolo: '!',
  },
  aprovada: {
    titulo: 'Sua reserva foi aprovada!',
    mensagem: 'O locador confirmou sua solicitação. O próximo passo é prosseguir para o pagamento e combinar a retirada.',
    simbolo: '✓',
  },
  recusada: {
    titulo: 'Motivo da recusa',
    mensagem: 'O locador não deu um motivo para a recusa.',
    simbolo: '!',
  },
  cancelada: {
    titulo: 'Esta reserva foi cancelada.',
    mensagem: 'Se precisar, você pode solicitar uma nova reserva para outras datas ou procurar equipamentos similares.',
    simbolo: 'i',
  },
};

export default function PainelStatusReserva({ status, motivoRecusa }: PainelStatusReservaProps) {
  const conteudo = CONTEUDO_POR_STATUS[status];
  const mensagem = status === 'recusada' && motivoRecusa ? motivoRecusa : conteudo.mensagem;

  return (
    <div className={`${styles.painel} ${styles[status]}`}>
      <span className={styles.simbolo} aria-hidden="true">
        {conteudo.simbolo}
      </span>

      <div className={styles.textoConteudo}>
        <p className={styles.titulo}>{conteudo.titulo}</p>
        <p className={styles.mensagem}>{mensagem}</p>
      </div>
    </div>
  );
}

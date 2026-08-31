import type { ReactNode } from 'react';
import type { StatusLocacao } from '../../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import { formatarIntervaloHorario } from '../../../utils/horario';
import styles from './PainelStatusLocacao.module.css';

interface PainelStatusLocacaoProps {
  status: StatusLocacao;
  motivoRecusa?: string; /** Usado apenas quando status === 'recusada' */
  motivoCancelamento?: string;
  horaInicio?: string; /** Horário de início escolhido na solicitação (usado em 'emTransporte') */
  horaFim?: string; /** Horário de término escolhido na solicitação (usado em 'aguardandoDevolucao') */
}

interface ConteudoStatus {
  titulo: string;
  mensagem: (horaInicio?: string, horaFim?: string) => ReactNode;
  simbolo: string;
}

// Trecho da mensagem exibido em destaque (ex: "24h")
function Destaque({ children }: { children: ReactNode }) {
  return <strong className={styles.destaque}>{children}</strong>;
}

// Textos padrão exibidos em cada estado da locacao
const CONTEUDO_POR_STATUS: Record<StatusLocacao, ConteudoStatus> = {
  pendente: {
    titulo: 'Sua solicitação está aguardando aprovação.',
    mensagem: () => (
      <>
        O locador tem até <Destaque>24h</Destaque> para analisar e responder.
      </>
    ),
    simbolo: '!',
  },
  aguardandoPagamento: {
    titulo: 'Sua locação foi aprovada!',
    mensagem: () => (
      <>
        O locador confirmou sua solicitação. Efetue o pagamento em até <Destaque>24h</Destaque> para continuar.
      </>
    ),
    simbolo: '✓',
  },
  preparandoEntrega: {
    titulo: 'Pagamento confirmado!',
    mensagem: () => 'O locador está preparando a ferramenta para envio.',
    simbolo: 'i',
  },
  emTransporte: {
    titulo: 'Sua ferramenta está a caminho.',
    mensagem: (horaInicio) =>
      horaInicio
        ? `Ela chegará entre ${formatarIntervaloHorario(horaInicio)}.`
        : 'Ela chegará em breve no endereço informado.',
    simbolo: 'i',
  },
  emAndamento: {
    titulo: 'Locação em andamento.',
    mensagem: () => 'Você recebeu a ferramenta. Aproveite o período contratado.',
    simbolo: '✓',
  },
  aguardandoDevolucao: {
    titulo: 'Está na hora de devolver.',
    mensagem: (_horaInicio, horaFim) =>
      horaFim
        ? `A ferramenta deve estar disponível para coleta entre ${formatarIntervaloHorario(horaFim)}.`
        : 'O período de locação está acabando e a ferramenta deve retornar para o locador.',
    simbolo: '!',
  },
  devolucaoEmTransporte: {
    titulo: 'Devolução em andamento.',
    mensagem: () => 'A ferramenta foi coletada e está voltando para o locador.',
    simbolo: 'i',
  },
  finalizada: {
    titulo: 'Locação finalizada!',
    mensagem: () => 'A locação foi concluída com sucesso.',
    simbolo: '✓',
  },
  recusada: {
    titulo: 'Motivo da recusa',
    mensagem: () => 'O locador não deu um motivo para a recusa.',
    simbolo: '!',
  },
  cancelada: {
    titulo: 'Esta locação foi cancelada.',
    mensagem: () =>
      'Se precisar, você pode solicitar uma nova locação para outras datas ou procurar equipamentos similares.',
    simbolo: 'i',
  },
};

export default function PainelStatusLocacao({
  status,
  motivoRecusa,
  motivoCancelamento,
  horaInicio,
  horaFim,
}: PainelStatusLocacaoProps) {
  const conteudo = CONTEUDO_POR_STATUS[status];

  // Lógica para definir a mensagem dinamicamente com base no status e motivos/horários fornecidos
  let mensagem: ReactNode = conteudo.mensagem(horaInicio, horaFim);
  if (status === 'recusada' && motivoRecusa) {
    mensagem = motivoRecusa;
  } else if (status === 'cancelada' && motivoCancelamento) {
    mensagem = motivoCancelamento;
  }

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
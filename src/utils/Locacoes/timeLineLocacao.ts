import { formatarIntervaloHorario } from '../Formatacao/horario';
import { formatarDiaMes, formatarDiaMesAno } from '../Formatacao/formatoDataBr';
import type { LocacaoData, StatusLocacao } from '../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';

/** Formata um ISO datetime (ex: `prazoPagamento`) como "dd/mm às HH:mm". */
function formatarPrazo(prazoIso: string): string {
    const data = new Date(prazoIso);
    if (Number.isNaN(data.getTime())) return '';
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes} às ${hora}:${minuto}`;
}

export type EstadoEtapaTimeline = 'concluida' | 'atual' | 'futura';

export interface EtapaTimelineLocacao {
    titulo: string;
    subtitulo: string;
    estado: EstadoEtapaTimeline;
}

/**
 * Posição (0 a 3) do status atual na linha do tempo simplificada exibida no card. Vários status granulares (ex: `preparandoEntrega`/`emTransporte`) compartilham a mesma etapa visual — o `StatusBadge` do card continua mostrando o status exato.
 */
function obterIndiceEtapaAtual(status: StatusLocacao): number {
    switch (status) {
        case 'pendente':
        case 'aguardandoPagamento':
            return 0;
        case 'confirmada':
        case 'preparandoEntrega':
        case 'emTransporte':
            return 1;
        case 'emAndamento':
            return 2;
        case 'aguardandoDevolucao':
        case 'devolucaoEmTransporte':
            return 3;
        case 'finalizada':
            return 4;
        // recusada/cancelada não têm uma linha do tempo de progresso — tratadas como "sem etapa atual" pelo chamador.
        case 'recusada':
        case 'cancelada':
            return -1;
    }
}

function obterEstado(indiceEtapa: number, indiceAtual: number): EstadoEtapaTimeline {
    if (indiceAtual < 0) return 'futura';
    if (indiceEtapa < indiceAtual) return 'concluida';
    if (indiceEtapa === indiceAtual) return 'atual';
    return 'futura';
}

/** Monta as 4 etapas da linha do tempo exibida no card expandido, com o rótulo, a data/horário correspondente e o estado (concluída/atual/futura) de cada uma. */
export function obterEtapasLocacao(locacao: LocacaoData): EtapaTimelineLocacao[] {
    const { status, dataInicio, horaInicio, dataFim, horaFim, prazoPagamento } = locacao;
    const indiceAtual = obterIndiceEtapaAtual(status);

    const subtituloPagamento =
        status === 'aguardandoPagamento' && prazoPagamento
            ? `Prazo: ${formatarPrazo(prazoPagamento)}`
            : indiceAtual > 0
                ? 'Concluído'
                : 'Aguardando pagamento';

    const rotuloEntrega = status === 'emTransporte' ? 'Em transporte' : 'Preparando entrega';
    const rotuloDevolucao = status === 'devolucaoEmTransporte' ? 'Devolução em transporte' : 'Receber devolução';

    return [
        {
            titulo: 'Pagamento confirmado',
            subtitulo: subtituloPagamento,
            estado: obterEstado(0, indiceAtual),
        },
        {
            titulo: rotuloEntrega,
            subtitulo: dataInicio && horaInicio ? `${formatarDiaMes(dataInicio)}, ${horaInicio}` : '—',
            estado: obterEstado(1, indiceAtual),
        },
        {
            titulo: 'Em uso',
            subtitulo: dataInicio && dataFim ? `${formatarDiaMes(dataInicio)} – ${formatarDiaMes(dataFim)}` : '—',
            estado: obterEstado(2, indiceAtual),
        },
        {
            titulo: rotuloDevolucao,
            subtitulo: dataFim && horaFim ? `${formatarDiaMes(dataFim)}, ${horaFim}` : '—',
            estado: obterEstado(3, indiceAtual),
        },
    ];
}

/** Texto de horário de entrega exibido no card expandido, ex: "23 Jul 2024 às 09:00". */
export function formatarHorarioEntrega(locacao: LocacaoData): string {
    const { dataInicio, horaInicio } = locacao;
    if (!dataInicio || !horaInicio) return '—';
    return `${formatarDiaMesAno(dataInicio)} às ${horaInicio}`;
}

/** Texto da janela de devolução exibido no card expandido, ex: "25 Jul 2024, das 17:00 às 20:00". */
export function formatarJanelaDevolucao(locacao: LocacaoData): string {
    const { dataFim, horaFim } = locacao;
    if (!dataFim || !horaFim) return '—';
    return `${formatarDiaMesAno(dataFim)}, das ${formatarIntervaloHorario(horaFim)}`;
}

/** Título + descrição curta da ação que o locador precisa tomar agora, de acordo com o status atual da locação. Exibido no card expandido (seção "O que você precisa fazer agora"). */
export function obterAcaoAgora(locacao: LocacaoData): { titulo: string; descricao: string } {
    switch (locacao.status) {
        case 'pendente':
            return { titulo: 'Analise a solicitação', descricao: 'Aprove ou recuse o pedido do locatário.' };
        case 'aguardandoPagamento':
            return {
                titulo: 'Aguarde a confirmação do pagamento',
                descricao: 'Assim que o locatário pagar, você poderá preparar a entrega.',
            };
        case 'confirmada':
        case 'preparandoEntrega':
            return {
                titulo: 'Prepare a ferramenta para a entrega',
                descricao: 'Deixe o equipamento pronto e disponível no horário combinado.',
            };
        case 'emTransporte':
            return {
                titulo: 'Acompanhe a entrega',
                descricao: 'A ferramenta está a caminho do locatário — acompanhe até a chegada.',
            };
        case 'emAndamento':
            return {
                titulo: 'Nenhuma ação necessária no momento',
                descricao: 'Aguarde o fim do período de uso para receber a devolução.',
            };
        case 'aguardandoDevolucao':
            return {
                titulo: 'Fique disponível para receber a ferramenta',
                descricao: 'Esteja no endereço combinado no horário definido para a devolução.',
            };
        case 'devolucaoEmTransporte':
            return {
                titulo: 'Aguarde o recebimento da ferramenta',
                descricao: 'A devolução está a caminho — aguarde a chegada do equipamento.',
            };
        case 'finalizada':
            return { titulo: 'Locação concluída', descricao: 'Nenhuma ação é necessária.' };
        case 'recusada':
            return { titulo: 'Solicitação recusada', descricao: 'Nenhuma ação é necessária.' };
        case 'cancelada':
            return { titulo: 'Locação cancelada', descricao: 'Nenhuma ação é necessária.' };
    }
}

/** Título + descrição breve do próximo status do fluxo, exibidos no card expandido. */
export function obterProximaEtapa(locacao: LocacaoData): { titulo: string; descricao: string } {
    switch (locacao.status) {
        case 'pendente':
            return { titulo: 'Aguardando pagamento', descricao: 'Após aprovar, o locatário terá um prazo para pagar.' };
        case 'aguardandoPagamento':
            return { titulo: 'Preparando entrega', descricao: 'Assim que o pagamento for confirmado.' };
        case 'confirmada':
        case 'preparandoEntrega':
            return { titulo: 'Em transporte', descricao: 'Quando a entrega for iniciada.' };
        case 'emTransporte':
            return { titulo: 'Em andamento', descricao: 'Quando a ferramenta chegar ao locatário.' };
        case 'emAndamento':
            return { titulo: 'Aguardando devolução', descricao: 'Ao fim do período de uso contratado.' };
        case 'aguardandoDevolucao':
            return { titulo: 'Devolução em transporte', descricao: 'Quando o locatário enviar a ferramenta de volta.' };
        case 'devolucaoEmTransporte':
            return { titulo: 'Finalizada', descricao: 'Quando você confirmar o recebimento da ferramenta.' };
        case 'finalizada':
            return { titulo: 'Concluída', descricao: 'Não há próximas etapas.' };
        case 'recusada':
            return { titulo: 'Sem próximas etapas', descricao: 'Esta solicitação foi recusada.' };
        case 'cancelada':
            return { titulo: 'Sem próximas etapas', descricao: 'Esta locação foi cancelada.' };
    }
}
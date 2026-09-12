import { Calendar, ChevronDown, ChevronRight, FileText, Package, User } from 'lucide-react';

import type { LocacaoData, StatusLocacao } from '../../../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import StatusBadge from '../../../MinhasLocacoes/EtiquetaStatus/EtiquetaStatus';
import { STATUS_CONFIG } from '../../../MinhasLocacoes/EtiquetaStatus/statusConfig';
import styles from './LocacaoHistoricoCard.module.css';

interface LocacaoHistoricoCardProps {
    locacao: LocacaoData;
    expandido: boolean;
    onToggle: (id: string) => void;
}

// Mensagem breve exibida em "Motivo do status" quando a locação não trouxe um motivo de cancelamento próprio
const MOTIVO_PADRAO: Partial<Record<StatusLocacao, string>> = {
    finalizada: 'Locação concluída com sucesso.',
    recusada: 'Você recusou esta solicitação de locação.',
    cancelada: 'Esta locação foi cancelada.',
};

// Motivo exibido: prioriza o motivo de cancelamento específico da locação, depois a mensagem de status já registrada nela e, por fim, um texto padrão breve para o status.
function obterMotivoStatus(locacao: LocacaoData): string {
    if (locacao.status === 'cancelada' && locacao.motivoCancelamento) {
        return locacao.motivoCancelamento;
    }
    return locacao.mensagemStatus || MOTIVO_PADRAO[locacao.status] || '';
}

export default function LocacaoHistoricoCard({ locacao, expandido, onToggle }: LocacaoHistoricoCardProps) {
    const { id, produto, imagem, periodo, locatario, status, valor, quantidade } = locacao;
    const config = STATUS_CONFIG[status];
    const IconeMotivo = config.icon;

    // Recusada e cancelada não geram cobrança: exibimos "—" em vez de "R$ 0,00" para não sugerir que houve algum valor efetivamente cobrado.
    const exibeValor = status === 'finalizada';
    const idDetalhes = `historico-detalhes-${id}`;

    return (
        <article className={`${styles.card} ${expandido ? styles.expandido : ''}`}>
            <button
                type="button"
                className={styles.cabecalho}
                onClick={() => onToggle(id)}
                aria-expanded={expandido}
                aria-controls={idDetalhes}
            >
                <span className={styles.miniatura}>
                    <img src={imagem} alt={produto} />
                </span>

                <span className={styles.nomeFerramenta}>{produto}</span>

                <span className={styles.locatarioInfo}>
                    <User className={styles.iconePequeno} aria-hidden="true" strokeWidth={2} />
                    {locatario}
                </span>

                <span className={styles.statusInfo}>
                    <StatusBadge status={status} />
                </span>

                <span className={`${styles.valor} ${exibeValor ? styles.valorPositivo : styles.valorNeutro}`}>
                    {exibeValor ? `+ ${valor}` : '—'}
                </span>

                <ChevronDown
                    className={`${styles.seta} ${expandido ? styles.setaAberta : ''}`}
                    aria-hidden="true"
                    strokeWidth={2}
                />
            </button>

            {expandido && (
                <div className={styles.detalhes} id={idDetalhes}>
                    <div className={styles.grade}>
                        <div className={styles.itemDetalhe}>
                            <Calendar className={styles.iconeDetalhe} aria-hidden="true" strokeWidth={2} />
                            <span className={styles.textoDetalhe}>
                                <span className={styles.rotulo}>Período</span>
                                <span className={styles.valorDetalhe}>{periodo}</span>
                            </span>
                        </div>

                        <div className={styles.itemDetalhe}>
                            <Package className={styles.iconeDetalhe} aria-hidden="true" strokeWidth={2} />
                            <span className={styles.textoDetalhe}>
                                <span className={styles.rotulo}>Quantidade</span>
                                <span className={styles.valorDetalhe}>
                                    {quantidade} {quantidade === 1 ? 'unidade' : 'unidades'}
                                </span>
                            </span>
                        </div>

                        <div className={styles.itemDetalhe}>
                            <span
                                className={styles.circuloMotivo}
                                style={
                                    {
                                        '--etiqueta-cor': config.cor,
                                        '--etiqueta-fundo': config.fundo,
                                        '--etiqueta-borda': config.borda,
                                    } as React.CSSProperties
                                }
                            >
                                <IconeMotivo className={styles.iconeMotivo} aria-hidden="true" strokeWidth={2} />
                            </span>
                            <span className={styles.textoDetalhe}>
                                <span className={styles.rotulo}>Motivo do status</span>
                                <span className={styles.valorDetalhe}>{obterMotivoStatus(locacao)}</span>
                            </span>
                        </div>
                    </div>

                    <div className={styles.rodapeDetalhes}>
                        <span className={styles.linkVerDetalhes}>
                            <FileText className={styles.iconeDocumento} aria-hidden="true" strokeWidth={2} />
                            <span className={styles.textoDetalhe}>
                                <span className={styles.linkTitulo}>Ver detalhes da locação</span>
                                <span className={styles.linkDescricao}>Confira todas as informações, mensagens e comprovantes.</span>
                            </span>
                        </span>

                        <button type="button" className={styles.botaoVerDetalhes}>
                            Ver detalhes
                            <ChevronRight aria-hidden="true" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            )}
        </article>
    );
}
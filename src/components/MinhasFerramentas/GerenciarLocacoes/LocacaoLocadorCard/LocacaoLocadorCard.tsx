import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  FileText,
  Package,
  Truck,
  Undo2,
  User,
} from 'lucide-react';
import type { ReactElement } from 'react';
import type { LocacaoData, StatusLocacao } from '../../../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import StatusBadge from '../../../MinhasLocacoes/EtiquetaStatus/EtiquetaStatus';
import {
  formatarHorarioEntrega,
  formatarJanelaDevolucao,
  obterAcaoAgora,
  obterProximaEtapa,
} from '../../../../utils/Locacoes/timeLineLocacao';
import styles from './LocacaoLocadorCard.module.css';

/** Ícone exibido junto de "O que você precisa fazer agora", de acordo com o status atual.
 * Retorna o elemento já renderizado (em vez do componente) para não disparar a regra react-hooks/static-components (componente "criado" durante o render). */
function renderizarIconeAcaoAgora(status: StatusLocacao): ReactElement {
  const props = { className: styles.acaoIcone, strokeWidth: 2, 'aria-hidden': true as const };
  switch (status) {
    case 'confirmada':
    case 'preparandoEntrega':
      return <Package {...props} />;
    case 'emTransporte':
    case 'devolucaoEmTransporte':
      return <Truck {...props} />;
    case 'aguardandoDevolucao':
      return <Undo2 {...props} />;
    case 'aguardandoPagamento':
      return <Clock {...props} />;
    case 'emAndamento':
    case 'finalizada':
    case 'recusada':
    case 'cancelada':
      return <CheckCircle2 {...props} />;
    default:
      return <Clock {...props} />;
  }
}

interface LocacaoLocadorCardProps {
  locacao: LocacaoData;
  onClick?: (locacao: LocacaoData) => void;
}

export default function LocacaoLocadorCard({ locacao, onClick }: LocacaoLocadorCardProps) {
  const { produto, imagem, periodo, locatario, status, mensagemStatus, valor, quantidade } = locacao;
  const [expandido, setExpandido] = useState(false);

  // Locações "pendente" continuam abrindo o modal de aprovação ao clicar (comportamento já existente) — para elas o card não expande.
  const ehPendente = status === 'pendente';

  const handleClickCard = () => {
    if (ehPendente) {
      onClick?.(locacao);
      return;
    }
    setExpandido((atual) => !atual);
  };

  const acaoAgora = obterAcaoAgora(locacao);
  const proximaEtapa = obterProximaEtapa(locacao);
  const cardExpandido = expandido && !ehPendente;

  return (
    <article className={`${styles.card} ${cardExpandido ? styles.cardExpandido : ''}`}>
      <button
        type="button"
        className={styles.cardButton}
        onClick={handleClickCard}
        aria-expanded={ehPendente ? undefined : cardExpandido}
      >
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

          {!cardExpandido ? <p className={styles.mensagemStatus}>{mensagemStatus}</p> : null}
        </div>

        <div className={styles.aside}>
          <StatusBadge status={status} />
          <span className={styles.valor}>{valor}</span>

          <span className={styles.iconeExpandir} aria-hidden="true">
            {ehPendente ? (
              <ChevronRight size={18} strokeWidth={2.25} />
            ) : cardExpandido ? (
              <ChevronUp size={18} strokeWidth={2.25} />
            ) : (
              <ChevronDown size={18} strokeWidth={2.25} />
            )}
          </span>
        </div>
      </button>

      {cardExpandido ? (
        <div className={styles.painelExpandido}>
          <div className={styles.acaoAgora}>
            <span className={styles.acaoIconeWrapper} aria-hidden="true">
              {renderizarIconeAcaoAgora(status)}
            </span>
            <div className={styles.acaoTexto}>
              <span className={styles.acaoRotulo}>O que você precisa fazer agora</span>
              <span className={styles.acaoTitulo}>{acaoAgora.titulo}</span>
              <p className={styles.acaoDescricao}>{acaoAgora.descricao}</p>
            </div>
          </div>

          <div className={styles.infoGrade}>
            <div className={styles.infoItem}>
              <span className={styles.infoCabecalho}>
                <Clock className={styles.infoIcone} aria-hidden="true" strokeWidth={2} />
                Horário da entrega
              </span>
              <span className={styles.infoValor}>{formatarHorarioEntrega(locacao)}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoCabecalho}>
                <Undo2 className={styles.infoIcone} aria-hidden="true" strokeWidth={2} />
                Receber devolução
              </span>
              <span className={styles.infoValor}>{formatarJanelaDevolucao(locacao)}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoCabecalho}>
                <Package className={styles.infoIcone} aria-hidden="true" strokeWidth={2} />
                Quantidade
              </span>
              <span className={styles.infoValor}>
                {quantidade} {quantidade === 1 ? 'unidade' : 'unidades'}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoCabecalho}>
                <ChevronRight className={styles.infoIcone} aria-hidden="true" strokeWidth={2} />
                Próxima etapa
              </span>
              <span className={styles.infoValor}>{proximaEtapa.titulo}</span>
              <span className={styles.infoDescricao}>{proximaEtapa.descricao}</span>
            </div>
          </div>

          <div className={styles.verMais}>
            <div className={styles.verMaisTexto}>
              <span className={styles.verMaisTitulo}>
                <FileText className={styles.verMaisIcone} aria-hidden="true" strokeWidth={2} />
                Ver mais da locação
              </span>
              <p className={styles.verMaisDescricao}>
                Confira todas as informações, mensagens, comprovantes e observações.
              </p>
            </div>

            <button type="button" className={styles.botaoVerDetalhes}>
              Ver detalhes
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}
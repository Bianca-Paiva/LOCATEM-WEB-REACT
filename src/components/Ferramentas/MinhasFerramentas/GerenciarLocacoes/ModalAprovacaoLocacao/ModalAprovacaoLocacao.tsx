import { Banknote, Calendar, Check, MapPin, User, Wrench, X } from 'lucide-react';

import type { LocacaoData } from '../../../../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import BtnNegativo from '../../../../Botoes/BtnNegativo/BtnNegativo';
import BtnPrincipal from '../../../../Botoes/BtnPrincipal/BtnPrincipal';
import styles from './ModalAprovacaoLocacao.module.css';

interface ModalAprovacaoLocacaoProps {
  locacao: LocacaoData | null;
  onAprovar: (locacao: LocacaoData) => void;
  onRecusar: (locacao: LocacaoData) => void;
  onFechar: () => void;
}

export default function ModalAprovacaoLocacao({
  locacao,
  onAprovar,
  onRecusar,
  onFechar,
}: ModalAprovacaoLocacaoProps) {
  if (!locacao) return null;

  const enderecoTexto = locacao.endereco
    ? `${locacao.endereco.ruaAvenida}, ${locacao.endereco.numero}${locacao.endereco.complemento ? ` — ${locacao.endereco.complemento}` : ''
    } — SP`
    : 'Endereço não informado';

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.botaoFechar} onClick={onFechar} aria-label="Fechar">
          <X size={16} strokeWidth={2.2} />
        </button>

        <div className={styles.cabecalho}>
          <div className={styles.miniatura}>
            <img src={locacao.imagem} alt={locacao.produto} />
          </div>

          <div className={styles.cabecalhoTexto}>
            {/* <span className={styles.badgePendente}>Solicitação pendente</span> */}
            <h2 className={styles.titulo}>Solicitação de Locação</h2>
            <p className={styles.subtitulo}>
              Revise os detalhes da solicitação e aprove ou recuse a locação deste equipamento.
            </p>
          </div>
        </div>

        <div className={styles.linhas}>
          <div className={styles.linha}>
            <span className={styles.label}>
              <Wrench className={styles.labelIcone} aria-hidden="true" strokeWidth={2} />
              Ferramenta
            </span>
            <span className={styles.valor}>{locacao.produto}</span>
          </div>
          <div className={styles.linha}>
            <span className={styles.label}>
              <User className={styles.labelIcone} aria-hidden="true" strokeWidth={2} />
              Locatário
            </span>
            <span className={styles.valor}>{locacao.locatario}</span>
          </div>
          <div className={styles.linha}>
            <span className={styles.label}>
              <Calendar className={styles.labelIcone} aria-hidden="true" strokeWidth={2} />
              Período
            </span>
            <span className={styles.valor}>{locacao.periodo}</span>
          </div>
          <div className={styles.linha}>
            <span className={styles.label}>
              <Banknote className={styles.labelIcone} aria-hidden="true" strokeWidth={2} />
              Valor total
            </span>
            <span className={styles.valorDestaque}>{locacao.valor}</span>
          </div>
          <div className={styles.linha}>
            <span className={styles.label}>
              <MapPin className={styles.labelIcone} aria-hidden="true" strokeWidth={2} />
              Endereço de entrega
            </span>
            <span className={styles.valor}>{enderecoTexto}</span>
          </div>
        </div>

        <div className={styles.acoes}>
          <BtnNegativo
            type="button"
            onClick={() => onRecusar(locacao)}
            icon={<X size={16} strokeWidth={2.4} />}
          >
            Recusar
          </BtnNegativo>

          <div className={styles.botaoAprovarWrapper}>
            <BtnPrincipal
              text="Aprovar solicitação"
              type="button"
              onClick={() => onAprovar(locacao)}
              icon={<Check size={17} strokeWidth={2.6} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { X, Check } from 'lucide-react';
import type { LocacaoData } from '../../../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
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
    ? `${locacao.endereco.ruaAvenida}, ${locacao.endereco.numero}${
        locacao.endereco.complemento ? ` — ${locacao.endereco.complemento}` : ''
      } — SP`
    : 'Endereço não informado';

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.cabecalho}>
          <h2 className={styles.titulo}>Solicitação de Locação</h2>
          <button type="button" className={styles.botaoFechar} onClick={onFechar} aria-label="Fechar">
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        <div className={styles.linhas}>
          <div className={styles.linha}>
            <span className={styles.label}>Ferramenta</span>
            <span className={styles.valor}>{locacao.produto}</span>
          </div>
          <div className={styles.linha}>
            <span className={styles.label}>Locatário</span>
            <span className={styles.valor}>{locacao.locatario}</span>
          </div>
          <div className={styles.linha}>
            <span className={styles.label}>Período</span>
            <span className={styles.valor}>{locacao.periodo}</span>
          </div>
          <div className={styles.linha}>
            <span className={styles.label}>Valor total</span>
            <span className={styles.valorDestaque}>{locacao.valor}</span>
          </div>
          <div className={styles.linha}>
            <span className={styles.label}>Endereço de entrega</span>
            <span className={styles.valor}>{enderecoTexto}</span>
          </div>
        </div>

        <div className={styles.acoes}>
          <button type="button" className={styles.botaoRecusar} onClick={() => onRecusar(locacao)}>
            <X size={16} strokeWidth={2.4} />
            Recusar
          </button>
          <button type="button" className={styles.botaoAprovar} onClick={() => onAprovar(locacao)}>
            <Check size={16} strokeWidth={2.4} />
            Aprovar solicitação
          </button>
        </div>
      </div>
    </div>
  );
}

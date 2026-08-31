import type { FiltroLocacao } from '../../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import { STATUS_CONFIG } from '../EtiquetaStatus/statusConfig';
import styles from './LocacaoAbas.module.css';

interface LocacaoTabsProps {
  filtro: FiltroLocacao;
  onChange: (filtro: FiltroLocacao) => void;
  contagem: Record<FiltroLocacao, number>;
}

// Ordem e rótulo de exibição de cada aba (segue a ordem do fluxo de uma locacao)
const ABAS: { key: FiltroLocacao; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendente', label: STATUS_CONFIG.pendente.tabLabel },
  { key: 'aguardandoPagamento', label: STATUS_CONFIG.aguardandoPagamento.tabLabel },
  { key: 'preparandoEntrega', label: STATUS_CONFIG.preparandoEntrega.tabLabel },
  { key: 'emTransporte', label: STATUS_CONFIG.emTransporte.tabLabel },
  { key: 'emAndamento', label: STATUS_CONFIG.emAndamento.tabLabel },
  { key: 'aguardandoDevolucao', label: STATUS_CONFIG.aguardandoDevolucao.tabLabel },
  { key: 'devolucaoEmTransporte', label: STATUS_CONFIG.devolucaoEmTransporte.tabLabel },
  { key: 'finalizada', label: STATUS_CONFIG.finalizada.tabLabel },
  { key: 'recusada', label: STATUS_CONFIG.recusada.tabLabel },
  { key: 'cancelada', label: STATUS_CONFIG.cancelada.tabLabel },
];

export default function LocacaoTabs({ filtro, onChange, contagem }: LocacaoTabsProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.rolagemAbas}>
        {ABAS.map((aba) => {
          const ativo = aba.key === filtro;
          return (
            <button
              key={aba.key}
              type="button"
              className={`${styles.aba} ${ativo ? styles.abaAtiva : ''}`}
              onClick={() => onChange(aba.key)}
              aria-pressed={ativo}
            >
              {aba.label}
              <span className={`${styles.contador} ${ativo ? styles.contadorAtivo : ''}`}>
                {contagem[aba.key]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
import type { FiltroReserva } from '../../../pages/MinhasReservas/MinhasReservas.types';
import styles from './ReservaAbas.module.css';

interface ReservaTabsProps {
  filtro: FiltroReserva;
  onChange: (filtro: FiltroReserva) => void;
  contagem: Record<FiltroReserva, number>;
}

// Ordem e rótulo de exibição de cada aba
const ABAS: { key: FiltroReserva; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'pendente', label: 'Pendentes' },
  { key: 'aprovada', label: 'Aprovadas' },
  { key: 'recusada', label: 'Recusadas' },
  { key: 'cancelada', label: 'Canceladas' },
];

export default function ReservaTabs({ filtro, onChange, contagem }: ReservaTabsProps) {
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

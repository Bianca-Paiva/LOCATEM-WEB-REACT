import type { StatusFerramenta } from '../../../types/produto.types';
import { STATUS_FERRAMENTA_CONFIG } from './statusFerramentaConfig';
import styles from './StatusFerramentaBadge.module.css';

interface StatusFerramentaBadgeProps {
  status: StatusFerramenta;
  /** Versão compacta (usada sobre a miniatura do card, mesmo espaço do selo de aprovação). */
  compacto?: boolean;
}

export default function StatusFerramentaBadge({ status, compacto = false }: StatusFerramentaBadgeProps) {
  const config = STATUS_FERRAMENTA_CONFIG[status];
  const Icone = config.icon;

  return (
    <span
      className={`${styles.etiqueta} ${compacto ? styles.compacto : ''}`}
      style={
        {
          '--etiqueta-cor': config.cor,
          '--etiqueta-borda': config.borda,
          '--etiqueta-fundo': config.fundo,
        } as React.CSSProperties
      }
    >
      <Icone className={styles.icone} aria-hidden="true" strokeWidth={2.25} />
      {config.label}
    </span>
  );
}

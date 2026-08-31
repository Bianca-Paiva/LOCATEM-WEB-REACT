import type { StatusLocacao } from '../../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import { STATUS_CONFIG } from './statusConfig';
import styles from './EtiquetaStatus.module.css';

interface EtiquetaStatusProps {
  status: StatusLocacao;
}

export default function EtiquetaStatus({ status }: EtiquetaStatusProps) {
  const config = STATUS_CONFIG[status];
  const Icone = config.icon;

  return (
    <span
      className={styles.etiqueta}
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

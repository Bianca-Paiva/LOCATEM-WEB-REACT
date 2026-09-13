import { Check } from 'lucide-react';
import type { EtapaTimelineLocacao } from '../../../../utils/Locacao/timeLineLocacao';
import styles from './LocacaoTimeline.module.css';

interface LocacaoTimelineProps {
  etapas: EtapaTimelineLocacao[];
}

/** Linha do tempo horizontal com as etapas da locação (concluída/atual/futura), cada uma com sua data/horário abaixo. Rola horizontalmente em telas estreitas para nunca sobrepor textos ou círculos. */
export default function LocacaoTimeline({ etapas }: LocacaoTimelineProps) {
  return (
    <div className={styles.wrapper}>
      <ol className={styles.linha}>
        {etapas.map((etapa, indice) => (
          <li key={etapa.titulo} className={styles.etapa} data-estado={etapa.estado}>
            <div className={styles.marcador}>
              <span className={styles.circulo}>
                {etapa.estado === 'concluida' ? (
                  <Check className={styles.iconeCheck} aria-hidden="true" strokeWidth={3} />
                ) : null}
              </span>
              {indice < etapas.length - 1 ? (
                <span
                  className={styles.conector}
                  data-preenchido={etapa.estado === 'concluida' ? 'true' : 'false'}
                />
              ) : null}
            </div>

            <div className={styles.textos}>
              <span className={styles.titulo}>{etapa.titulo}</span>
              <span className={styles.subtitulo}>{etapa.subtitulo}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

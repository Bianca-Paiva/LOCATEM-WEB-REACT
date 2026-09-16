import { Clock, Truck, Undo2 } from 'lucide-react';
import { formatarDiaMes } from '../../../../utils/Formatacao/formatoDataBr';
import type { AgendaSemanaLocadorItem } from '../../../../pages/Home/HomeLocador/HomeLocador.types';
import styles from './HomeLocadorAgendaItem.module.css';

interface HomeLocadorAgendaItemProps {
  evento: AgendaSemanaLocadorItem;
}

/**
 * Textos e ícone de cada movimento logístico. Como a entrega é feita por uma
 * transportadora terceirizada, evitamos "Retirada"/"Devolução" (ambíguos quanto
 * a quem está com a ferramenta no momento) e deixamos o sentido do trajeto
 * explícito: LOCADOR -> transportadora -> LOCATÁRIO, e depois o caminho inverso.
 */
const CONFIG_MOVIMENTO = {
  coletaParaEntrega: {
    label: 'Coleta para entrega',
    complemento: 'Transportadora indo buscar com você',
    icon: Truck,
    cor: '#137333',
    fundo: '#E6F4EA',
  },
  retornoAoLocador: {
    label: 'Retorno ao locador',
    complemento: 'Transportadora trazendo de volta',
    icon: Undo2,
    cor: '#BA1A1A',
    fundo: '#FFDAD6',
  },
} as const;

/** Linha compacta de um evento logístico na seção "Agenda da Semana" da Home do Locador. */
export default function HomeLocadorAgendaItem({ evento }: HomeLocadorAgendaItemProps) {
  const config = CONFIG_MOVIMENTO[evento.tipoMovimento];
  const Icone = config.icon;

  return (
    <li className={styles.item}>
      <div className={styles.data}>
        <span className={styles.dia}>{formatarDiaMes(evento.data).split(' ')[0]}</span>
        <span className={styles.mes}>{formatarDiaMes(evento.data).split(' ')[1]}</span>
      </div>

      <img src={evento.imagem} alt={evento.ferramenta} className={styles.imagem} />

      <div className={styles.info}>
        <p className={styles.ferramenta}>{evento.ferramenta}</p>
        <p className={styles.locatario}>{evento.locatario}</p>
      </div>

      <div className={styles.hora}>
        <Clock size={13} strokeWidth={2} aria-hidden="true" />
        {evento.hora}
      </div>

      <span className={styles.movimento} style={{ color: config.cor, background: config.fundo }}>
        <Icone size={13} strokeWidth={2} aria-hidden="true" />
        <span>
          {config.label}
          <em>{config.complemento}</em>
        </span>
      </span>
    </li>
  );
}

import { useMemo } from 'react';
import IconSeta from '../../../assets/IconSeta.png';
import { formatarIso, getHojeIso } from '../../../utils/dataLocacao';
import styles from './CalendarioLocacao.module.css';

const NOMES_MES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

interface CelulaDia {
  iso: string;
  dia: number;
  foraDoMes: boolean;
}

/** Monta a grade de 6 semanas (42 células) do mês de referência, incluindo os dias de preenchimento dos meses vizinhos. */
function montarGradeMes(mesReferencia: Date): CelulaDia[] {
  const ano = mesReferencia.getFullYear();
  const mes = mesReferencia.getMonth();

  const primeiroDiaMes = new Date(ano, mes, 1);
  const offsetInicial = primeiroDiaMes.getDay(); // 0 = domingo

  const inicioGrade = new Date(ano, mes, 1 - offsetInicial);

  return Array.from({ length: 42 }, (_, i) => {
    const data = new Date(inicioGrade);
    data.setDate(inicioGrade.getDate() + i);
    return {
      iso: formatarIso(data),
      dia: data.getDate(),
      foraDoMes: data.getMonth() !== mes,
    };
  });
}

interface CalendarioLocacaoProps {
  /** Primeiro dia do mês atualmente exibido */
  mesReferencia: Date;
  onMudarMes: (novoMes: Date) => void;
  /** Data de entrega e devolução já escolhidas (podem estar vazias), usadas para destacar o intervalo */
  dataEntrega: string;
  dataDevolucao: string;
  /** Datas anteriores a esta (yyyy-mm-dd) são tratadas como passado e bloqueadas */
  dataMinima: string;
  /** Datas locadas/indisponíveis (yyyy-mm-dd) */
  diasIndisponiveis: Set<string>;
  onSelecionar: (dataIso: string) => void;
}

export default function CalendarioLocacao({
  mesReferencia,
  onMudarMes,
  dataEntrega,
  dataDevolucao,
  dataMinima,
  diasIndisponiveis,
  onSelecionar,
}: CalendarioLocacaoProps) {
  const hojeIso = useMemo(() => getHojeIso(), []);
  const dias = useMemo(() => montarGradeMes(mesReferencia), [mesReferencia]);

  // Não deixa navegar para antes do mês da data mínima permitida
  const mesMinimo = dataMinima.slice(0, 7);
  const mesAtualStr = `${mesReferencia.getFullYear()}-${String(mesReferencia.getMonth() + 1).padStart(2, '0')}`;
  const prevDesabilitado = mesAtualStr <= mesMinimo;

  const irParaMesAnterior = () => {
    if (prevDesabilitado) return;
    onMudarMes(new Date(mesReferencia.getFullYear(), mesReferencia.getMonth() - 1, 1));
  };

  const irParaProximoMes = () => {
    onMudarMes(new Date(mesReferencia.getFullYear(), mesReferencia.getMonth() + 1, 1));
  };

  return (
    <div className={styles.calendario}>
      <div className={styles.cabecalho}>
        <button
          type="button"
          className={styles.navBotao}
          onClick={irParaMesAnterior}
          disabled={prevDesabilitado}
          aria-label="Mês anterior"
        >
          <img src={IconSeta} alt="" className={styles.setaEsquerda} />
        </button>
        <span className={styles.mesLabel}>
          {NOMES_MES[mesReferencia.getMonth()]} {mesReferencia.getFullYear()}
        </span>
        <button
          type="button"
          className={styles.navBotao}
          onClick={irParaProximoMes}
          aria-label="Próximo mês"
        >
          <img src={IconSeta} alt="" className={styles.setaDireita} />
        </button>
      </div>

      <div className={styles.semana}>
        {DIAS_SEMANA.map((letra, i) => (
          <span key={i} className={styles.semanaLabel}>{letra}</span>
        ))}
      </div>

      <div className={styles.grade}>
        {dias.map(({ iso, dia, foraDoMes }) => {
          const passado = iso < dataMinima;
          const indisponivel = diasIndisponiveis.has(iso);
          const desabilitado = passado || indisponivel || foraDoMes;

          const isEntrega = iso === dataEntrega;
          const isDevolucao = iso === dataDevolucao;
          const noIntervalo = Boolean(
            dataEntrega && dataDevolucao && iso > dataEntrega && iso < dataDevolucao,
          );
          const isHoje = iso === hojeIso;

          const classes = [styles.dia];
          if (foraDoMes) classes.push(styles.diaForaDoMes);
          if (desabilitado && !foraDoMes) classes.push(styles.diaDesabilitado);
          if (indisponivel && !foraDoMes) classes.push(styles.diaIndisponivel);
          if (noIntervalo) classes.push(styles.diaNoIntervalo);
          if (isEntrega || isDevolucao) classes.push(styles.diaSelecionado);
          if (isEntrega && dataDevolucao) classes.push(styles.diaSelecionadoInicio);
          if (isDevolucao && dataEntrega) classes.push(styles.diaSelecionadoFim);
          if (isHoje) classes.push(styles.diaHoje);

          return (
            <button
              key={iso}
              type="button"
              className={classes.join(' ')}
              disabled={desabilitado}
              onClick={() => onSelecionar(iso)}
              title={indisponivel && !foraDoMes ? 'Indisponível' : undefined}
            >
              {dia}
            </button>
          );
        })}
      </div>

      <div className={styles.legenda}>
        <span className={styles.legendaItem}>
          <i className={`${styles.legendaBolinha} ${styles.legendaDisponivel}`} /> Disponível
        </span>
        <span className={styles.legendaItem}>
          <i className={`${styles.legendaBolinha} ${styles.legendaIndisponivel}`} /> Indisponível
        </span>
      </div>
    </div>
  );
}

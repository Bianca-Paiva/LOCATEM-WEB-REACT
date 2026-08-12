import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CalendarioDisponibilidade.module.css';

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

interface DiaCalendario {
  data: Date;
  dataIso: string;
  numero: number;
  mesAtual: boolean;
  passada: boolean;
  hoje: boolean;
}

function formatarIso(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function montarGrade(mesReferencia: Date): DiaCalendario[] {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const ano = mesReferencia.getFullYear();
  const mes = mesReferencia.getMonth();

  const primeiroDiaMes = new Date(ano, mes, 1);
  const ultimoDiaMes = new Date(ano, mes + 1, 0);
  const offsetInicio = primeiroDiaMes.getDay(); // 0 = domingo
  const totalDiasMes = ultimoDiaMes.getDate();

  const totalCelulas = Math.ceil((offsetInicio + totalDiasMes) / 7) * 7;
  const dias: DiaCalendario[] = [];

  for (let i = 0; i < totalCelulas; i++) {
    const numeroDia = i - offsetInicio + 1;
    const data = new Date(ano, mes, numeroDia);
    data.setHours(0, 0, 0, 0);

    dias.push({
      data,
      dataIso: formatarIso(data),
      numero: data.getDate(),
      mesAtual: data.getMonth() === mes,
      passada: data.getTime() < hoje.getTime(),
      hoje: data.getTime() === hoje.getTime(),
    });
  }

  return dias;
}

interface CalendarioDisponibilidadeProps {
  diasIndisponiveis: string[];
  onToggleDia: (dataIso: string) => void;
}

export default function CalendarioDisponibilidade({
  diasIndisponiveis,
  onToggleDia,
}: CalendarioDisponibilidadeProps) {
  const [mesReferencia, setMesReferencia] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });

  const dias = useMemo(() => montarGrade(mesReferencia), [mesReferencia]);
  const indisponiveisSet = useMemo(() => new Set(diasIndisponiveis), [diasIndisponiveis]);

  const irParaMesAnterior = () =>
    setMesReferencia((atual) => new Date(atual.getFullYear(), atual.getMonth() - 1, 1));

  const irParaProximoMes = () =>
    setMesReferencia((atual) => new Date(atual.getFullYear(), atual.getMonth() + 1, 1));

  return (
    <div className={styles.wrapper}>
      <div className={styles.navegacao}>
        <button type="button" onClick={irParaMesAnterior} aria-label="Mês anterior" className={styles.navBotao}>
          <ChevronLeft size={18} />
        </button>
        <span className={styles.mesLabel}>
          {MESES[mesReferencia.getMonth()]} {mesReferencia.getFullYear()}
        </span>
        <button type="button" onClick={irParaProximoMes} aria-label="Próximo mês" className={styles.navBotao}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className={styles.gradeCabecalho}>
        {DIAS_SEMANA.map((dia) => (
          <span key={dia}>{dia}</span>
        ))}
      </div>

      <div className={styles.grade}>
        {dias.map((dia) => {
          const indisponivel = indisponiveisSet.has(dia.dataIso);
          const clicavel = dia.mesAtual && !dia.passada;

          const classes = [styles.dia];
          if (!dia.mesAtual || dia.passada) classes.push(styles.diaPassada);
          else if (indisponivel) classes.push(styles.diaIndisponivel);
          else classes.push(styles.diaDisponivel);
          if (dia.hoje) classes.push(styles.diaHoje);

          return (
            <button
              key={dia.dataIso}
              type="button"
              className={classes.join(' ')}
              disabled={!clicavel}
              onClick={() => clicavel && onToggleDia(dia.dataIso)}
            >
              {dia.numero}
            </button>
          );
        })}
      </div>

      <div className={styles.legenda}>
        <span className={styles.legendaItem}>
          <span className={`${styles.legendaCor} ${styles.legendaDisponivel}`} /> Disponível
        </span>
        <span className={styles.legendaItem}>
          <span className={`${styles.legendaCor} ${styles.legendaIndisponivel}`} /> Indisponível
        </span>
        <span className={styles.legendaItem}>
          <span className={`${styles.legendaCor} ${styles.legendaPassada}`} /> Data passada
        </span>
      </div>

      <p className={styles.instrucao}>
        Clique em um dia para marcar como indisponível. Clique novamente para desmarcar.
      </p>
    </div>
  );
}

import { useEffect, useState } from 'react';
import styles from './CompletarPerfil.module.css';

interface CompletarPerfilProps {
  percentual: number;
  mensagemDica: string;
}

/** Tempo (ms) que o card fica visível após atingir 100%, antes de começar a sumir. */
const TEMPO_ATE_SUMIR = 3000;
/** Duração (ms) da animação de saída — precisa bater com a transition do CSS. */
const DURACAO_ANIMACAO_SAIDA = 300;

/** Card "Complete seu Perfil" — barra e texto refletem o percentual calculado em useCompletudePerfil.
 *  Quando o perfil chega a 100%, o card some sozinho após alguns segundos. */
export default function CompletarPerfil({ percentual, mensagemDica }: CompletarPerfilProps) {
  const [saindo, setSaindo] = useState(false);
  const [oculto, setOculto] = useState(false);

  // Guarda o último percentual só para detectar a "volta" para baixo de 100%.
  // Ajustar estado durante a renderização (em vez de num efeito) evita o set-state-em-cascata que o react-hooks/set-state-in-effect reclama.
  const [percentualAnterior, setPercentualAnterior] = useState(percentual);
  if (percentual !== percentualAnterior) {
    setPercentualAnterior(percentual);
    if (percentual < 100) {
      setSaindo(false);
      setOculto(false);
    }
  }

  // Agenda o início da animação de saída assim que o perfil bate 100%.
  // setState aqui só acontece dentro do callback do timer, nunca de forma síncrona no corpo do efeito.
  useEffect(() => {
    if (percentual < 100) return;

    const timerSaida = setTimeout(() => setSaindo(true), TEMPO_ATE_SUMIR);
    return () => clearTimeout(timerSaida);
  }, [percentual]);

  // Só remove o card do DOM depois que a animação de saída termina, pra não "sumir" de golpe
  useEffect(() => {
    if (!saindo) return;

    const timerOculto = setTimeout(() => setOculto(true), DURACAO_ANIMACAO_SAIDA);
    return () => clearTimeout(timerOculto);
  }, [saindo]);

  if (oculto) return null;

  return (
    <div className={`${styles.wrapper} ${saindo ? styles.wrapperSaindo : ''}`}>
      <section className={styles.card}>
        <div className={styles.linhaTitulo}>
          <h2 className={styles.titulo}>Complete seu Perfil</h2>
          <span className={styles.percentual}>{percentual}% concluído</span>
        </div>

        <div className={styles.barraFundo} role="progressbar" aria-valuenow={percentual} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.barraPreenchida} style={{ width: `${percentual}%` }} />
        </div>

        <p className={styles.dica}>{mensagemDica}</p>
      </section>
    </div>
  );
}
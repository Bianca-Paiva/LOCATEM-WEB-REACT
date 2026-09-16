import type { ReactNode } from 'react';
import styles from './HomeLocadorResumoCard.module.css';

interface HomeLocadorResumoCardProps {
  icone: ReactNode;
  /** Cor do ícone e do círculo de fundo — reaproveita a mesma paleta já usada nos badges de status (ver statusConfig.ts / statusFerramentaConfig.ts), nunca uma cor nova. */
  corIcone: string;
  fundoIcone: string;
  label: string;
  valor: string;
  /** Texto auxiliar cinza abaixo do valor (ex: "de 4 ferramentas ativas"). Ignorado quando `tendencia` é informado. */
  legenda?: string;
  /** Texto com seta de tendência (ex: "+1 este mês"), sempre em tom positivo — omitido quando não há dado real para mostrar (nunca inventamos "+0"). */
  tendencia?: string;
  /** Conteúdo extra abaixo do valor (usado pelo card "Avaliação Média" para exibir as estrelas). */
  extra?: ReactNode;
}

/**
 * Card de resumo (KPI) do topo da Home do Locador: "Ferramentas Ativas",
 * "Locações em andamento", "Solicitações pendentes", "Faturamento do mês" e
 * "Avaliação Média" são todos a mesma peça visual, só variando ícone/cor/dado.
 */
export default function HomeLocadorResumoCard({
  icone,
  corIcone,
  fundoIcone,
  label,
  valor,
  legenda,
  tendencia,
  extra,
}: HomeLocadorResumoCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconeWrapper} style={{ color: corIcone, background: fundoIcone }}>
        {icone}
      </div>

      <div className={styles.conteudo}>
        <p className={styles.label}>{label}</p>
        <p className={styles.valor}>{valor}</p>

        {tendencia ? (
          <p className={styles.tendencia}>{tendencia}</p>
        ) : legenda ? (
          <p className={styles.legenda}>{legenda}</p>
        ) : null}

        {extra}
      </div>
    </div>
  );
}

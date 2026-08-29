import type { ResumoLocacaoCalculado } from '../../../pages/Locacoes/SolicitarLocacao/SolicitarLocacao.types';
import styles from './ResumoLocacao.module.css';

interface ResumoLocacaoProps {
  resumo: ResumoLocacaoCalculado;
}

export default function ResumoLocacao({ resumo }: ResumoLocacaoProps) {
  const {
    dataEntregaFormatada,
    dataDevolucaoFormatada,
    diarias,
    entregaHorarioFormatado,
    devolucaoHorarioFormatado,
    aluguelFormatado,
    freteFormatado,
    valorFormatado,
  } = resumo;

  return (
    <section className={styles.card}>
      <h2 className={styles.titulo}>Resumo da locação</h2>

      <div className={styles.linhaPeriodo}>
        <span className={styles.rotuloPeriodo}>Período</span>
        <span className={styles.valorPeriodo}>
          {dataEntregaFormatada} - {dataDevolucaoFormatada}{' '}
          <span className={styles.diarias}>
            ({diarias} {diarias === 1 ? 'diária' : 'diárias'})
          </span>
        </span>
      </div>

      <div className={styles.boxes}>
        <div className={styles.box}>
          <span className={styles.boxLabel}>Entrega</span>
          <span className={styles.boxValor}>{entregaHorarioFormatado}</span>
        </div>
        <div className={styles.box}>
          <span className={styles.boxLabel}>Devolução</span>
          <span className={styles.boxValor}>{devolucaoHorarioFormatado}</span>
        </div>
      </div>

      <div className={styles.divisor} />

      <div className={styles.linha}>
        <span className={styles.rotulo}>Aluguel</span>
        <span className={styles.valor}>{aluguelFormatado}</span>
      </div>

      <div className={styles.linha}>
        <span className={styles.rotulo}>Frete</span>
        <span className={styles.valor}>{freteFormatado}</span>
      </div>

      <div className={styles.divisorForte} />

      <div className={styles.linhaDestaque}>
        <span className={styles.rotuloDestaque}>Valor Total</span>
        <span className={styles.valorDestaque}>{valorFormatado}</span>
      </div>

      <div className={styles.aviso}>
        <svg
          className={styles.avisoIcone}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="9.25" y="8.5" width="1.5" height="5.5" rx="0.75" fill="currentColor" />
          <circle cx="10" cy="6" r="0.9" fill="currentColor" />
        </svg>
        <div>
          <p>A devolução será coletada no mesmo endereço informado acima. Caso seja necessário alterar o local de coleta, isso poderá ser feito posteriormente na locação.</p>
          <p>Você só será cobrado quando a locação for aceita pelo locador.</p>
        </div>
      </div>
    </section>
  );
}
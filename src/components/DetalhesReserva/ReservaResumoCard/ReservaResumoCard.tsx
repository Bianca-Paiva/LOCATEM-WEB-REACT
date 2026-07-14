import type { ReservaData } from '../../../pages/Reservas/MinhasReservas/MinhasReservas.types';
import calendarioIcon from '../../../assets/iconCalendarioReservas.png';
import userIcon from '../../../assets/IconUser.png';
import starIcon from '../../../assets/StarFullYellow.png';
import localizacaoIcon from '../../../assets/IconLocalizacao.png';
import styles from './ReservaResumoCard.module.css';

interface ReservaResumoCardProps {
  reserva: ReservaData;
}

export default function ReservaResumoCard({ reserva }: ReservaResumoCardProps) {
  const {
    produto,
    imagem,
    categoria,
    locador,
    avaliacaoLocador,
    numeroAvaliacoes,
    localizacao,
    dataInicio,
    horaInicio,
    dataFim,
    horaFim,
    quantidade,
    valorEstimado,
  } = reserva;

  return (
    <section className={styles.card}>
      <div className={styles.cabecalhoProduto}>
        <div className={styles.miniatura}>
          <img src={imagem} alt={produto} />
        </div>

        <div className={styles.infoProduto}>
          <h2 className={styles.titulo}>{produto}</h2>
          <p className={styles.categoria}>{categoria}</p>

          <p className={styles.locador}>
            <img src={userIcon} alt="" className={styles.iconePequeno} />
            Locador: <span>{locador}</span>
          </p>

          <div className={styles.linhaAvaliacaoLocalizacao}>
            <span className={styles.avaliacao}>
              <img src={starIcon} alt="" className={styles.iconePequeno} />
              {avaliacaoLocador.toFixed(1).replace('.', ',')}
              <span className={styles.numeroAvaliacoes}>({numeroAvaliacoes} avaliações)</span>
            </span>
            <span className={styles.separador}>•</span>
            <span className={styles.localizacao}>
              <img src={localizacaoIcon} alt="" className={styles.iconePequeno} />
              {localizacao}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.periodoBloco}>
        <p className={styles.periodoRotulo}>Período solicitado</p>
        <div className={styles.periodoCaixa}>
          <img src={calendarioIcon} alt="" className={styles.iconeCalendario} />
          <div className={styles.periodoTexto}>
            <p>
              <strong>{dataInicio}</strong> às {horaInicio}
            </p>
            <p className={styles.ate}>até</p>
            <p>
              <strong>{dataFim}</strong> às {horaFim}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.rodape}>
        <div>
          <p className={styles.rodapeRotulo}>Quantidade</p>
          <p className={styles.rodapeValor}>
            {quantidade} {quantidade === 1 ? 'unidade' : 'unidades'}
          </p>
        </div>

        <div className={styles.rodapeAlinhadoDireita}>
          <p className={styles.rodapeRotulo}>Valor estimado</p>
          <p className={styles.rodapeValorDestaque}>{valorEstimado}</p>
        </div>
      </div>
    </section>
  );
}

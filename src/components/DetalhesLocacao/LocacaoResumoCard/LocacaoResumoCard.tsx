import { Calendar, User, MapPin } from 'lucide-react';
import type { LocacaoData } from '../../../pages/Locacoes/MinhasLocacoes/MinhasLocacoes.types';
import { formatarIntervaloHorario } from '../../../utils/horario';
import starIcon from '../../../assets/StarFullYellow.png';
import styles from './LocacaoResumoCard.module.css';

interface LocacaoResumoCardProps {
  locacao: LocacaoData;
}

export default function LocacaoResumoCard({ locacao }: LocacaoResumoCardProps) {
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
    valor,
  } = locacao;

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
            <User className={styles.iconePequeno} aria-hidden="true" strokeWidth={2} />
            Locador: <span>{locador}</span>
          </p>

          <div className={styles.linhaAvaliacaoLocalizacao}>
            <span className={styles.avaliacao}>
              <img src={starIcon} alt="" className={styles.iconePequenoStar} />
              {avaliacaoLocador.toFixed(1).replace('.', ',')}
              <span className={styles.numeroAvaliacoes}>({numeroAvaliacoes} avaliações)</span>
            </span>
            <span className={styles.separador}>•</span>
            <span className={styles.localizacao}>
              <MapPin className={styles.iconePequeno} aria-hidden="true" strokeWidth={2} />
              {localizacao}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.periodoBloco}>
        <p className={styles.periodoRotulo}>Período solicitado</p>
        <div className={styles.periodoCaixa}>
          <Calendar className={styles.iconeCalendario} aria-hidden="true" strokeWidth={2} />
          <div className={styles.periodoTexto}>
            <p>
              <strong>{dataInicio}</strong> das {formatarIntervaloHorario(horaInicio)}
            </p>
            <p className={styles.ate}>até</p>
            <p>
              <strong>{dataFim}</strong> das {formatarIntervaloHorario(horaFim)}
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
          <p className={styles.rodapeValorDestaque}>{valor}</p>
        </div>
      </div>
    </section>
  );
}
import type { ProdutoSelecionado } from '../../../context/ProdutoContext';
import userIcon from '../../../assets/IconUser.png';
import starIcon from '../../../assets/StarFullYellow.png';
import localizacaoIcon from '../../../assets/IconLocalizacao.png';
import styles from './ProdutoResumoCard.module.css';

interface ProdutoResumoCardProps {
  produto: ProdutoSelecionado;
}

export default function ProdutoResumoCard({ produto }: ProdutoResumoCardProps) {
  const {
    title,
    images,
    categoria,
    locador,
    rating,
    reviewCount,
    localizacao,
    price,
  } = produto;

  return (
    <section className={styles.card}>
      <div className={styles.miniatura}>
        <img src={images?.[0]} alt={title} />
      </div>

      <div className={styles.infoProduto}>
        <h2 className={styles.titulo}>{title}</h2>
        <p className={styles.categoria}>{categoria}</p>

        <p className={styles.locador}>
          <img src={userIcon} alt="" className={styles.iconePequeno} />
          Locador: <span>{locador}</span>
        </p>

        <div className={styles.linhaAvaliacaoLocalizacao}>
          <span className={styles.avaliacao}>
            <img src={starIcon} alt="" className={styles.iconePequenoStar} />
            {rating.toFixed(1).replace('.', ',')}
            <span className={styles.numeroAvaliacoes}>({reviewCount} avaliações)</span>
          </span>
          <span className={styles.separador}>•</span>
          <span className={styles.localizacao}>
            <img src={localizacaoIcon} alt="" className={styles.iconePequeno} />
            {localizacao}
          </span>
        </div>
      </div>

      <div className={styles.precoBloco}>
        <span className={styles.precoValor}>R$ {price}</span>
        <span className={styles.precoUnidade}>/diária</span>
      </div>
    </section>
  );
}

import { User, Star, MapPin } from 'lucide-react';
import type { ProdutoSelecionado } from '../../../context/ProdutoContext';
import styles from './ProdutoResumoCardProdutoResumoCardSolicitacao.module.css';

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
          <User className={styles.iconePequeno} aria-hidden="true" strokeWidth={2} />
          Locador: <span>{locador}</span>
        </p>

        <div className={styles.linhaAvaliacaoLocalizacao}>
          <span className={styles.avaliacao}>
            <Star className={styles.iconePequenoStar} aria-hidden="true" fill="#FFCA00" color="#FFCA00" strokeWidth={0} />
            {rating.toFixed(1).replace('.', ',')}
            <span className={styles.numeroAvaliacoes}>({reviewCount} avaliações)</span>
          </span>
          <span className={styles.separador}>•</span>
          <span className={styles.localizacao}>
            <MapPin className={styles.iconePequeno} aria-hidden="true" strokeWidth={2} />
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
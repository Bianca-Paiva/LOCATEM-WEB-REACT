import { useRef } from 'react';
import { ProductCard } from '../../ProductCard/ProductCard';
import styles from './ProdutosSemelhantes.module.css';

interface ProdutoSemelhante {
  id?: number;
  title: string;
  brand: string;
  price: string;
  image: string;
  imageVerificado: string;
  imageNota: string;
  rating: number;
  reviewCount: number;
}

interface ProdutosSemelhantesProps {
  produtos: ProdutoSemelhante[];
  onCardClick?: (produto: ProdutoSemelhante) => void;
}

export function ProdutosSemelhantes({ produtos, onCardClick }: ProdutosSemelhantesProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' });
  };

  return (
    <section className={styles.sectionWrapper}>
      <h2 className={styles.titulo}>Ferramentas Semelhantes</h2>

      <div className={styles.carrosselContainer}>
        <button
          className={`${styles.navBtn} ${styles.navBtnLeft}`}
          onClick={() => scroll('left')}
          aria-label="Rolar para esquerda"
        >
          ‹
        </button>

        <div className={styles.carrosselTrack} ref={trackRef}>
          {produtos.map((p, i) => (
            <div key={i} className={styles.cardWrapper}>
              <ProductCard
                title={p.title}
                brand={p.brand}
                price={p.price}
                image={p.image}
                imageVerificado={p.imageVerificado}
                imageNota={p.imageNota}
                rating={p.rating}
                reviewCount={p.reviewCount}
                onNavigate={onCardClick ? () => onCardClick(p) : undefined}
              />
            </div>
          ))}
        </div>

        <button
          className={`${styles.navBtn} ${styles.navBtnRight}`}
          onClick={() => scroll('right')}
          aria-label="Rolar para direita"
        >
          ›
        </button>
      </div>
    </section>
  );
}
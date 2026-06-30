import { useState } from 'react';
import styles from './ImagemCarrossel.module.css';

interface ImagemCarrosselProps {
  images: string[];
  title: string;
}

export function ImagemCarrossel({ images, title }: ImagemCarrosselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => setCurrentIndex(prev => (prev + 1) % images.length);
  const goPrev = () => setCurrentIndex(prev => (prev - 1 + images.length) % images.length);

  return (
    <div className={styles.carrosselWrapper}>
      <div className={styles.imagemPrincipalContainer}>
        <button className={`${styles.navBtn} ${styles.navBtnLeft}`} onClick={goPrev} aria-label="Imagem anterior">
          ‹
        </button>
        <img
          src={images[currentIndex]}
          alt={title}
          className={styles.imagemPrincipal}
        />
        <button className={`${styles.navBtn} ${styles.navBtnRight}`} onClick={goNext} aria-label="Próxima imagem">
          ›
        </button>
      </div>

      <div className={styles.dotsContainer}>
        {images.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === currentIndex ? styles.dotAtivo : ''}`}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Ir para imagem ${i + 1}`}
          />
        ))}
      </div>

      <div className={styles.thumbnailsContainer}>
        {images.map((img, i) => (
          <button
            key={i}
            className={`${styles.thumbnail} ${i === currentIndex ? styles.thumbnailAtivo : ''}`}
            onClick={() => setCurrentIndex(i)}
          >
            <img src={img} alt={`Miniatura ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
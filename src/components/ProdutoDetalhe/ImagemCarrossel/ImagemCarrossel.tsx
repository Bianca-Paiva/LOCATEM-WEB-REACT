import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import styles from './ImagemCarrossel.module.css';

interface ImagemCarrosselProps {
  images: string[];
  title: string;
}

export function ImagemCarrossel({ images, title }: ImagemCarrosselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  // Navegação pelos botões customizados usando a instância do Swiper
  const goNext = () => swiperRef?.slideNext();
  const goPrev = () => swiperRef?.slidePrev();

  // Navegação pelas miniaturas/dots
  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    swiperRef?.slideTo(index);
  };

  return (
    <div className={styles.carrosselWrapper}>
      <div className={styles.imagemPrincipalContainer}>
        {/* Botão Anterior */}
        <button
          className={`${styles.navBtn} ${styles.navBtnLeft}`}
          onClick={goPrev}
          aria-label="Imagem anterior"
        >
          ‹
        </button>

        {/* Swiper no lugar da <img> estática */}
        <Swiper
          onSwiper={(swiper) => setSwiperRef(swiper)}
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
          spaceBetween={0}
          slidesPerView={1}
          className={styles.swiperContainer}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`${title} - Foto ${index + 1}`}
                className={styles.imagemPrincipal}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Botão Próximo */}
        <button
          className={`${styles.navBtn} ${styles.navBtnRight}`}
          onClick={goNext}
          aria-label="Próxima imagem"
        >
          ›
        </button>
      </div>

      <div className={styles.dotsContainer}>
        {images.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === currentIndex ? styles.dotAtivo : ''}`}
            onClick={() => goToIndex(i)}
            aria-label={`Ir para imagem ${i + 1}`}
          />
        ))}
      </div>

      <div className={styles.thumbnailsContainer}>
        {images.map((img, i) => (
          <button
            key={i}
            className={`${styles.thumbnail} ${i === currentIndex ? styles.thumbnailAtivo : ''}`}
            onClick={() => goToIndex(i)}
          >
            <img src={img} alt={`Miniatura ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
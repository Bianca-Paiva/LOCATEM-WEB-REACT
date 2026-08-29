import React from 'react';
import styles from './ProductCard.module.css';

import { Icon } from "@iconify/react";
import { Star } from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

interface ProductCardProps {
  images: string[]; // array de imagens
  title: string;
  brand: string;
  price: string;
  imageNota?: string;
  /** Selo de verificação do locador (não exibido no card hoje; aceito para compatibilidade com o mock). */
  imageVerificado?: string;
  rating: number;
  reviewCount: number; // Quando fornecido, o card inteiro vira clicável e chama essa função 
  onNavigate?: () => void;
  /** Forma de aprovação da locação. Quando informado, exibe um selo no card (ex: telas de "Minhas Ferramentas"). */
  tipoAprovacao?: 'manual' | 'automatica';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  images,
  title,
  brand,
  price,
  rating,
  reviewCount,
  onNavigate,
  tipoAprovacao,
}) => {
  const content = (
    <>
      <div className={styles.productImageContainer}>
        {/* Swiper no lugar da imagem estática */}
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          className={styles.productInnerSwiper}
          onClick={() => onNavigate && onNavigate()}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={img} alt={`${title} - Foto ${index + 1}`} className={styles.productCardImg} />
            </SwiperSlide>
          ))}
        </Swiper>

        {tipoAprovacao && (
          <span
            className={`${styles.badgeAprovacao} ${tipoAprovacao === 'automatica' ? styles.badgeAprovacaoAutomatica : styles.badgeAprovacaoManual
              }`}
          >
            {tipoAprovacao === 'automatica' ? 'Aprovação automática' : 'Aprovação manual'}
          </span>
        )}
      </div>

      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{title}</h3>

        <div className={styles.productBrandRow}>
          <span className={styles.productBrand}>{brand}</span>
          <div>
            <Icon
              icon={"codicon:verified-filled"}
              width={14}
              height={14}
              className={styles.logoVerificado}
            />
          </div>
        </div>

        <div className={styles.productFooter}>
          <div className={styles.productPriceRow}>
            <span className={styles.pricePrefix}>R$</span>
            <span className={styles.priceValue}>{price}</span>
            <span className={styles.priceSuffix}>/dia</span>
          </div>

          <div className={styles.productRating}>
            <Star 
              className={styles.estrelaAvaliacao} 
              size={14} 
              fill="#FFCA00" 
              color="#FFCA00" 
              strokeWidth={0} 
            />
            <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
            <span className={styles.ratingCount}>({reviewCount})</span>
          </div>
        </div>
      </div>
    </>
  );

  // Usamos uma <div> com role="button" para evitar bugs de HTML com o Swiper embutido
  if (onNavigate) {
    return (
      <div
        className={`${styles.productCard} ${styles.productCardClickable}`}
        onClick={onNavigate}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalhes de ${title}`}
      >
        {content}
      </div>
    );
  }

  return <div className={styles.productCard}>{content}</div>;
};
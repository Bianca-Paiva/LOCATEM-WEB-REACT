import React, { useState } from 'react';
import { useAuth } from '../../../hooks/Auth/useAuth';
import { useFavoritos } from '../../../hooks/Conta/Favoritos/useFavoritos';
import styles from './ProductCard.module.css';

import { Icon } from "@iconify/react";
import { Heart, Star } from 'lucide-react';

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
  /** Selo de status exibido no canto superior esquerdo da imagem (ex: "Disponível", "Locada" em Minhas Ferramentas). Substitui o selo de aprovação quando informado. */
  statusBadge?: React.ReactNode;
  /** Conteúdo extra renderizado abaixo das informações do produto (ex: botões "Ver"/"Editar" em Minhas Ferramentas). */
  footerExtra?: React.ReactNode;
  /** Classe visual opcional para customizações específicas de uma página. */
  className?: string;
  /** Exibe o coração decorativo usado nos cards da vitrine. */
  showFavorite?: boolean;
  /** Exibe o botão visual de detalhes no rodapé do card. */
  showDetailsButton?: boolean;
  /** Identificador real da ferramenta usado para persistir favoritos no backend. */
  productId?: number;
  /** Variação visual usada na tela de Favoritos. */
  variant?: 'default' | 'favorito';
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
  statusBadge,
  footerExtra,
  className,
  showFavorite = false,
  productId,
  variant = 'default',
}) => {
  const [favoritadoLocal, setFavoritadoLocal] = useState(false);
  const { usuario } = useAuth();
  const { isFavoritado, isProcessando, toggleFavorito } = useFavoritos();

  const podeFavoritar = usuario?.tipo === 'locatario';

  const favoritado = productId !== undefined
    ? isFavoritado(productId)
    : favoritadoLocal;

  const favoritoProcessando = productId !== undefined
    ? isProcessando(productId)
    : false;

  const handleFavorito = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    if (favoritoProcessando) return;

    if (productId === undefined) {
      setFavoritadoLocal((estadoAtual) => !estadoAtual);
      return;
    }

    if (!usuario) {
      window.location.hash = 'login';
      return;
    }


    
    try {
      await toggleFavorito(productId);
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

  const content = (
    <>
      {statusBadge ? (
        <span className={styles.badgeAprovacao}>{statusBadge}</span>
      ) : (
        tipoAprovacao && (
          <span
            className={`${styles.badgeAprovacao} ${tipoAprovacao === 'automatica' ? styles.badgeAprovacaoAutomatica : styles.badgeAprovacaoManual
              }`}
          >
            {tipoAprovacao === 'automatica' ? 'Aprovação automática' : 'Aprovação manual'}
          </span>
        )
      )}
     {showFavorite && podeFavoritar && (
  <button
    type="button"
    className={`${styles.favoriteButton} ${
      favoritado ? styles.favoriteButtonActive : ''
    }`}
    aria-label={favoritado ? `Remover ${title} dos favoritos` : `Favoritar ${title}`}
    aria-pressed={favoritado}
    onClick={handleFavorito}
    disabled={favoritoProcessando}
  >
 <Heart
  size={22}
  strokeWidth={1.8}
  color={favoritado ? '#ff4655' : '#222'}
  fill={favoritado ? '#ff4655' : 'none'}
/>
    
  </button>
)}
      <div className={styles.productImageContainer}>
        {images.length > 0 ? (
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
        ) : (
          <div className={styles.productSemImagem}>Imagem não cadastrada</div>
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

        {footerExtra}

       
        
      </div>
    </>
  );

  // Usamos uma <div> com role="button" para evitar bugs de HTML com o Swiper embutido
  const classes = [
    styles.productCard,
    className ?? '',
    onNavigate ? styles.productCardClickable : '',
    variant === 'favorito' ? styles.productCardFavorito : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (onNavigate) {
    return (
      <div
        className={classes}
        onClick={onNavigate}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalhes de ${title}`}
      >
        {content}
      </div>
    );
  }

  return <div className={classes}>{content}</div>;
};
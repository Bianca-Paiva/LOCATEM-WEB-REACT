import React from 'react';
import './ProductCard.css';

interface ProductCardProps {
  image: string;
  title: string;
  brand: string;
  price: string;
  imageVerificado: string;
  imageNota: string;
  rating: number;
  reviewCount: number;
  /** Quando fornecido, o card inteiro vira clicável e chama essa função */
  onNavigate?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  brand,
  price,
  imageVerificado,
  rating,
  imageNota,
  reviewCount,
  onNavigate,
}) => {
  const content = (
    <>
      <div className="product-image-container">
        <img src={image} alt={title} className="product-card-img" />
      </div>

      <div className="product-info">
        <h3 className="product-title">{title}</h3>

        <div className="product-brand-row">
          <span className="product-brand">{brand}</span>
          <div>
            <img src={imageVerificado} alt="Verificado" className="logo-Verificado" />
          </div>
        </div>

        <div className="product-footer">
          <div className="product-price-row">
            <span className="price-prefix">R$</span>
            <span className="price-value">{price}</span>
            <span className="price-suffix">/dia</span>
          </div>

          <div className="product-rating">
            <img src={imageNota} alt="Notas" className="estrela-avaliação" />
            <span className="rating-value">{rating.toFixed(1)}</span>
            <span className="rating-count">({reviewCount})</span>
          </div>
        </div>
      </div>
    </>
  );

  if (onNavigate) {
    return (
      <button
        className="product-card product-card--clickable"
        onClick={onNavigate}
        aria-label={`Ver detalhes de ${title}`}
      >
        {content}
      </button>
    );
  }

  return <div className="product-card">{content}</div>;
};
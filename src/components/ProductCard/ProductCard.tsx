import React from 'react';
import './ProductCard.css';

interface ProductCardProps {
  image: string;
  title: string;
  brand: string;
  price: string;
  verified?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ image, title, brand, price, verified = true }) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={image} alt={title} className="product-card-img" />
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{title}</h3>
        
        <div className="product-brand-row">
          <span className="product-brand">{brand}</span>
          {verified && (
            <span className="verified-badge" title="Fornecedor Verificado">✓</span>
          )}
        </div>
        
        <div className="product-price-row">
          <span className="price-prefix">R$</span>
          <span className="price-value">{price}</span>
          <span className="price-suffix">/dia</span>
        </div>
      </div>
    </div>
  );
};
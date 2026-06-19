import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header'; 
import { Banner } from '../../components/Banner/Banner';
import { CategoryFilter } from '../../components/CategoryFilter/CategoryFilter';
import { ProductCard } from '../../components/ProductCard/ProductCard';

// Dados dos produtos iguais ao do seu print de referência
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: 'Furadeira Parafusadeira The Black Tools',
    brand: 'MS Ferramentas',
    price: '15,00',
    image: 'src/assets/Furadeira1.webp',
   imageVerificado:'src/assets/verificado.png',// Substitua pelas suas imagens reais da pasta assets dps
   imageNota:'src/assets/StarFull.png',
   rating: 4.5,
   reviewCount: 124
  },
  {
    id: 2,
    title: 'Pistola de Pintura The Black Tools',
    brand: 'WZ Ferramentas',
    price: '30,00',
    image: 'src/assets/pistolaPintura.png',
   imageVerificado:'src/assets/verificado.png',// Substitua pelas suas imagens reais da pasta assets dps
   imageNota:'src/assets/StarFull.png',
   rating: 4.2,
   reviewCount: 87
  },
  {
    id: 3,
    title: 'Parafusadeira Furadeira de Impacto Hanabi',
    brand: 'João Ferramentas',
    price: '28,00',
    image: 'src/assets/Furadeira3.webp',
   imageVerificado:'src/assets/verificado.png',// Substitua pelas suas imagens reais da pasta assets dps
   imageNota:'src/assets/StarFull.png',
   rating: 4.7,
   reviewCount: 201
  },
  {
    id: 4,
    title: 'Aparador De Grama Bipartido Tramontina',
    brand: 'JB Ferramentas',
    price: '18,00',
    image: 'src/assets/aparadorGrama.webp',
    imageVerificado:'src/assets/verificado.png',// Substitua pelas suas imagens reais da pasta assets dps
   imageNota:'src/assets/StarFull.png',
   rating: 4.1,
   reviewCount: 45
  },

   {
    id: 5,
    title: 'Parafusadeira e Furadeira WAP 12V',
    brand: 'JB Ferramentas',
    price: '18,00',
    image: 'src/assets/Furadeira4.webp',
    imageVerificado:'src/assets/verificado.png',// Substitua pelas suas imagens reais da pasta assets dps
   imageNota:'src/assets/StarFull.png',
   rating: 4.3,
   reviewCount: 62
  },

   {
    id: 6,
    title: 'Parafusadeira e Furadeira WAP BPF 12V',
    brand: 'JB Ferramentas',
    price: '18,00',
    image: 'src/assets/parafusadeira-furadeira-WAP.webp',
    imageVerificado:'src/assets/verificado.png',// Substitua pelas suas imagens reais da pasta assets dps
   imageNota:'src/assets/StarFull.png',
   rating: 4.0,
   reviewCount: 38
  },

   {
    id: 7,
    title: 'Serra circular profissional DESOON 24 Dentes',
    brand: 'JB Ferramentas',
    price: '18,00',
    image: 'src/assets/aparadorGrama.webp',
    imageVerificado:'src/assets/verificado.png',// Substitua pelas suas imagens reais da pasta assets dps
   imageNota:'src/assets/StarFull.png',
   rating: 4.6,
   reviewCount: 153
  },

   {
    id: 8,
    title: 'Parafusadeira e furadeira WAP 12V Cinza',
    brand: 'JB Ferramentas',
    price: '18,00',
    image: 'src/assets/parafusadeira-wap.png',
    imageVerificado:'src/assets/verificado.png',// Substitua pelas suas imagens reais da pasta assets dps
   imageNota:'src/assets/StarFull.png',
   rating: 3.9,
   reviewCount: 27
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleNavigate = (route: string) => navigate(`/${route}`);

  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      <Header navigate={handleNavigate} currentRoute="home" />
      
    <main style={{ paddingTop: 0, marginTop: 0 }}>
        <Banner />
        
        {/* Renderiza o título "Ferramentas" e as pílulas de filtro */}
        <CategoryFilter />
        
        {/* Grid de Produtos alinhado com o container principal */}
        <div style={{
          maxWidth: '1428px',
          margin: '24px auto 0',
          padding: '0 16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              brand={product.brand}
              price={product.price}
              image={product.image}
              imageVerificado={product.imageVerificado}
              imageNota={product.imageNota}
              rating={product.rating}
              reviewCount={product.reviewCount}

            />
          ))}
        </div>
      </main>
    </div>
  );
};
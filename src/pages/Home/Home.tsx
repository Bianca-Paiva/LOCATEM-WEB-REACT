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
    image: 'src/assets/Furadeira1.webp' // Substitua pelas suas imagens reais da pasta assets dps
  },
  {
    id: 2,
    title: 'Pistola de Pintura The Black Tools',
    brand: 'WZ Ferramentas',
    price: '30,00',
    image: 'src/assets/pistolaPintura.png'
  },
  {
    id: 3,
    title: 'Parafusadeira Furadeira de Impacto Hanabi',
    brand: 'João Ferramentas',
    price: '28,00',
    image: 'src/assets/Furadeira3.webp'
  },
  {
    id: 4,
    title: 'Aparador De Grama Bipartido Tramontina',
    brand: 'JB Ferramentas',
    price: '18,00',
    image: 'src/assets/aparadorGrama.webp'
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const handleNavigate = (route: string) => navigate(`/${route}`);

  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      <Header navigate={handleNavigate} currentRoute="home" />
      
      <main style={{ paddingBottom: '40px' }}>
        <Banner />
        
        {/* Renderiza o título "Ferramentas" e as pílulas de filtro */}
        <CategoryFilter />
        
        {/* Grid de Produtos alinhado com o container principal */}
        <div style={{
          maxWidth: '1200px',
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
            />
          ))}
        </div>
      </main>
    </div>
  );
};
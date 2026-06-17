import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Banner.css';

interface BannerData {
  id: number;
  image: string;
  altText: string;
  link?: string; // O link é opcional (por isso o '?')
}

// Array com os dados dos seus banners (substitua os caminhos pelas suas imagens reais depois)
const BANNERS_MOCK: BannerData[] = [
  {
    id: 1,
    image: 'src/assets/anuncioLocatem.png', // Caminho da sua imagem na pasta assets
    altText: 'Promoção de Julho - 25% OFF em ferramentas',
    link: '/promocao'
  },
  {
    id: 2,
    image: 'src/assets/anuncioLocador1.png',
    altText: 'As melhores parafusadeiras com desconto',
    link: ''
  }
];

export const Banner: React.FC = () => {
  return (
    <div className="banner-container">
      <Swiper
        // Ativamos os módulos que importamos anteriormente
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}        // Sem espaço entre os slides para o efeito de transição ficar limpo
        slidesPerView={1}       // Mostra apenas 1 banner por vez
        navigation={true}       // Ativa as setas laterais
        pagination={{ clickable: true }} // Ativa as bolinhas inferiores clicáveis
        autoplay={{ delay: 4000, disableOnInteraction: false }} // Passa sozinho a cada 4 segundos
        loop={true}             // Quando chegar no último, volta para o primeiro infinitamente
        className="banner-swiper"
      >
        {BANNERS_MOCK.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="banner-slide">
              <img src={banner.image} alt={banner.altText} className="banner-image" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
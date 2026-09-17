import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './Banner.module.css';

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
    image: 'src/assets/Anuncios/anuncioLocador01.png', // Caminho da sua imagem na pasta assets
    altText: 'Promoção de Julho - 25% OFF em ferramentas',
    link: '/promocao'
  },
  {
    id: 2,
    image: 'src/assets/Anuncios/anuncioLocatem.png',
    altText: 'As melhores parafusadeiras com desconto',
    link: ''
  },

  {
    id: 3,
    image: 'src/assets/Anuncios/anuncioLocador02.png',
    altText: 'Alugue a partir de 29,90',
    link: ''
  }
];

export const Banner: React.FC = () => {
  return (
    <div className={styles.bannerContainer}>
      <Swiper
        pagination={{
          el: `.${styles.bannerCustomPagination}`,
          clickable: true
        }}
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}        // Sem espaço entre os slides para o efeito de transição ficar limpo
        slidesPerView={1}       // Mostra apenas 1 banner por vez
        navigation={false}      // Desativa as setas laterais
        autoplay={{ delay: 4000, disableOnInteraction: false }} // Passa sozinho a cada 4 segundos
        // Quando chegar no último, volta para o primeiro infinitamente
        className={styles.bannerSwiper}
      >
        {BANNERS_MOCK.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className={styles.bannerSlide}>
              <img src={banner.image} alt={banner.altText} className={styles.bannerImage} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Onde as bolinhas vão se renderizar, fora do Swiper */}
      <div className={styles.bannerCustomPagination}></div>
    </div>
  );
};
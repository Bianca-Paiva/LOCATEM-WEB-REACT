import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import anuncioLocador01 from '../../../assets/Anuncios/anuncioLocador01.png';
import anuncioLocador02 from '../../../assets/Anuncios/anuncioLocador02.png';
import anuncioLocatem from '../../../assets/Anuncios/anuncioLocatem.png';

import styles from './Banner.module.css';

interface BannerData {
  id: number;
  image: string;
  altText: string;
}

const BANNERS: BannerData[] = [
  {
    id: 1,
    image: anuncioLocador01,
    altText: 'Promoções LOCATEM',
  },
  {
    id: 2,
    image: anuncioLocatem,
    altText: 'Ofertas LOCATEM',
  },
  {
    id: 3,
    image: anuncioLocador02,
    altText: 'Ofertas para locadores LOCATEM',
  },
];

export const Banner: React.FC = () => {
  return (
    <div className={styles.bannerContainer}>
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{
          el: `.${styles.bannerCustomPagination}`,
          clickable: true,
        }}
        slidesPerView={1}
        spaceBetween={0}
        loop
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className={styles.bannerSwiper}
      >
        {BANNERS.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className={styles.bannerSlide}>
              <img
                src={banner.image}
                alt={banner.altText}
                className={styles.bannerImage}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.bannerCustomPagination} />
    </div>
  );
};
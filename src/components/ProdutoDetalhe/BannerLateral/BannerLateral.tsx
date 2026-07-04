import styles from './BannerLateral.module.css';

export function BannerLateral() {
  return (
    <div className={styles.bannerWrapper}>
      <img
        src="src/assets/banner-desktop.png"
        alt="Black Friday LOCATEM - Ferramentas com até 50% de desconto"
        className={styles.bannerImg}
      />
    </div>
  );
}
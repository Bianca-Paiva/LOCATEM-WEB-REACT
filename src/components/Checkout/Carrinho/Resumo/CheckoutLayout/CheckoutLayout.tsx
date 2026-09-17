import type { ReactNode } from 'react';
import styles from './CheckoutLayout.module.css';

interface CheckoutLayoutProps {
  onBack?: () => void;
  children: ReactNode;
  aside: ReactNode;
}

export function CheckoutLayout({children, aside }: CheckoutLayoutProps) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.grid}>
          <div className={styles.coluna}>{children}</div>
          <aside className={styles.colunaAside}>{aside}</aside>
        </div>
      </main>
    </div>
  );
}
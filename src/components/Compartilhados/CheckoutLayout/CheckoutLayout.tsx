import type { ReactNode } from 'react';
import styles from './CheckoutLayout.module.css';
import { PageHeaderBack } from '../PageHeaderBack/PageHeaderBack';

interface CheckoutLayoutProps {
  titulo: string;
  onBack?: () => void;
  children: ReactNode;
  aside: ReactNode;
}

export function CheckoutLayout({ titulo, onBack, children, aside }: CheckoutLayoutProps) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <PageHeaderBack title={titulo} onBack={onBack} />
        <div className={styles.grid}>
          <div className={styles.coluna}>{children}</div>
          <aside className={styles.colunaAside}>{aside}</aside>
        </div>
      </main>
    </div>
  );
}

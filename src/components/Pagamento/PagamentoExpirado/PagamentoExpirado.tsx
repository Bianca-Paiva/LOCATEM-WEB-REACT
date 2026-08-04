import styles from './PagamentoExpirado.module.css';
import { AlertCircle } from 'lucide-react';

interface PagamentoExpiradoProps {
  onGerarNovoQrCode?: () => void;
}

export function PagamentoExpirado({ onGerarNovoQrCode }: PagamentoExpiradoProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconeCirculo}>
        <AlertCircle size={32} color="#ef4444" strokeWidth={1.8} />
      </div>
      <p className={styles.titulo}>Tempo Expirado</p>
      <p className={styles.subtitulo}>
        O código Pix expirou. Gere um novo código para continuar.
      </p>
      <button className={styles.btnGerar} onClick={onGerarNovoQrCode}>
        Gerar Novo QR Code
      </button>
    </div>
  );
}

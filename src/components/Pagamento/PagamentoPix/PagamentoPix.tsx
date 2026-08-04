import { useEffect, useState } from 'react';
import styles from './PagamentoPix.module.css';
import { QrCode, Copy } from 'lucide-react';

interface PagamentoPixProps {
  pixCode: string;
  /** Tempo total do QR Code, em segundos, usado apenas para exibir o contador. */
  duracaoSegundos?: number;
  onCopiarCodigo?: (codigo: string) => void;
  aguardandoPagamento?: boolean;
}

const PASSOS = [
  'Abra o app do seu banco e escolha pagar com PIX',
  'Escaneie o QR Code ou cole o código copiado',
  'Confirme o pagamento no app do seu banco',
];

function formatarTempo(segundos: number) {
  const m = Math.floor(segundos / 60).toString().padStart(2, '0');
  const s = Math.floor(segundos % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function PagamentoPix({
  pixCode,
  duracaoSegundos = 600,
  onCopiarCodigo,
  aguardandoPagamento = true,
}: PagamentoPixProps) {
  const [tempoRestante, setTempoRestante] = useState(duracaoSegundos);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (tempoRestante <= 0) return;
    const id = setInterval(() => setTempoRestante(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(id);
  }, [tempoRestante]);

  function handleCopiar() {
    onCopiarCodigo?.(pixCode);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className={styles.card}>
      <p className={styles.expiraTexto}>
        Expira em <span>{formatarTempo(tempoRestante)}</span>
      </p>

      {/* Placeholder visual — substituir pela geração real do QR Code (ex: lib "qrcode.react") */}
      <div className={styles.qrBox}>
        <QrCode size={140} strokeWidth={1.2} color="#0a0a0a" />
      </div>

      <p className={styles.instrucao}>Escaneie o QR Code com seu app do banco</p>

      <div className={styles.divisorTexto}>
        <span className={styles.linha} />
        ou
        <span className={styles.linha} />
      </div>

      <div className={styles.codigoRow}>
        <input className={styles.codigoInput} readOnly value={pixCode} />
        <button className={styles.btnCopiarIcone} onClick={handleCopiar} aria-label="Copiar código">
          <Copy size={16} />
        </button>
      </div>

      <button className={styles.btnCopiar} onClick={handleCopiar}>
        {copiado ? 'Código copiado!' : 'Copiar Código PIX'}
      </button>

      <div className={styles.passosBloco}>
        <p className={styles.passosTitulo}>Como pagar com PIX:</p>
        <ol className={styles.passosLista}>
          {PASSOS.map((passo, i) => (
            <li key={i}>
              <span className={styles.passoNumero}>{i + 1}</span>
              {passo}
            </li>
          ))}
        </ol>
      </div>

      {aguardandoPagamento && (
        <p className={styles.aguardando}>
          <span className={styles.spinner} />
          Aguardando pagamento...
        </p>
      )}
    </div>
  );
}

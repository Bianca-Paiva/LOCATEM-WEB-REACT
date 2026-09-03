import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import QRCode from 'react-qr-code';
import FormInput from '../../Inputs/FormInput/FormInput';

import styles from './PagamentoPixCard.module.css';

interface PagamentoPixCardProps {
  codigoPix: string;
  copiado: boolean;
  onCopiarCodigo: () => void;
}

const instrucoesPix = [
  "Abra o app do seu banco e escolha pagar com PIX",
  "Escaneie o QR Code ou cole o código copiado",
  "Confirme o pagamento no app do seu banco"
];

export function PagamentoPixCard({ codigoPix, copiado, onCopiarCodigo }: PagamentoPixCardProps) {
  const [mostrarCodigoCompleto, setMostrarCodigoCompleto] = useState(false);

  return (
    <section className={styles.card}>

      <div className={styles.qrSection}>
        <div className={styles.qrWrapper}>
          <QRCode
            value={codigoPix}
            size={220}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            viewBox={`0 0 256 256`}
          />
        </div>

        <div>
          <p className={styles.labelQrcode}>Escaneie o QR Code com seu app bancário.</p>
        </div>
      </div>

      <div className={styles.campo}>
        <label className={styles.label} htmlFor="codigoPix">
          Código Pix (Copia e Cola)
        </label>

        <div className={styles.inputCodigo}>
          <div className={styles.input}>
            <FormInput
              id="codigoPix"
              type="text"
              readOnly
              value={
                mostrarCodigoCompleto
                  ? codigoPix
                  : `${codigoPix.slice(0, 28)}…`
              }
              onFocus={() => setMostrarCodigoCompleto(true)}
              onBlur={() => setMostrarCodigoCompleto(false)}
            />
          </div>
          <button
            type="button"
            className={`${styles.btnCopiar} ${copiado ? styles.copiado : ''}`}
            onClick={onCopiarCodigo}
          >
            {copiado ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
            <span>{copiado ? 'Copiado!' : 'Copiar código'}</span>
          </button>
        </div>
      </div>

      <div className={styles.instrucoesContainer}>
        <h3 className={styles.label}>Como pagar com PIX:</h3>
        <ul className={styles.listaInstrucoes}>
          {instrucoesPix.map((instrucao, index) => (
            <li key={index} className={styles.itemInstrucao}>
              <span className={styles.numeroInstrucao}>{index + 1}</span>
              <span className={styles.textoInstrucao}>{instrucao}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
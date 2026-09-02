import { useState } from 'react';
import { Check, Copy, QrCode } from 'lucide-react';

import styles from './PagamentoPixCard.module.css';

interface PagamentoPixCardProps {
  codigoPix: string;
  copiado: boolean;
  onCopiarCodigo: () => void;
}

const TAMANHO_GRADE = 21;

// Gera uma sequência determinística de 0/1 a partir do código Pix, só para
// desenhar o miolo do QR Code (visual/mock — não é um QR Code decodificável).
function gerarMiolo(seed: string): boolean[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const celulas: boolean[] = [];
  for (let i = 0; i < TAMANHO_GRADE * TAMANHO_GRADE; i += 1) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    celulas.push((hash >> 16) % 3 === 0);
  }

  return celulas;
}

// Marcador de posição (finder pattern) no estilo dos três cantos de um QR Code real.
function Marcador({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={7} height={7} className={styles.moduloAtivo} />
      <rect x={1} y={1} width={5} height={5} className={styles.moduloClaro} />
      <rect x={2} y={2} width={3} height={3} className={styles.moduloAtivo} />
    </g>
  );
}

function QrCodePix({ codigo }: { codigo: string }) {
  const celulas = gerarMiolo(codigo);
  const dentroDeMarcador = (col: number, row: number) =>
    (col < 7 && row < 7) ||
    (col >= TAMANHO_GRADE - 7 && row < 7) ||
    (col < 7 && row >= TAMANHO_GRADE - 7);

  return (
    <svg
      viewBox={`0 0 ${TAMANHO_GRADE} ${TAMANHO_GRADE}`}
      className={styles.qr}
      role="img"
      aria-label="QR Code para pagamento via Pix"
    >
      <rect width={TAMANHO_GRADE} height={TAMANHO_GRADE} className={styles.moduloClaro} />

      {celulas.map((ativo, indice) => {
        const col = indice % TAMANHO_GRADE;
        const row = Math.floor(indice / TAMANHO_GRADE);

        if (!ativo || dentroDeMarcador(col, row)) return null;

        return <rect key={indice} x={col} y={row} width={1} height={1} className={styles.moduloAtivo} />;
      })}

      <Marcador x={0} y={0} />
      <Marcador x={TAMANHO_GRADE - 7} y={0} />
      <Marcador x={0} y={TAMANHO_GRADE - 7} />
    </svg>
  );
}

// Card "Pagamento via Pix" — única tela do fluxo de checkout que ainda não existia.
// Segue o mesmo padrão visual dos demais cards de pagamento (AdicionarCartaoForm, CartaoSelecionavel).
export function PagamentoPixCard({ codigoPix, copiado, onCopiarCodigo }: PagamentoPixCardProps) {
  const [mostrarCodigoCompleto, setMostrarCodigoCompleto] = useState(false);

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.titulo}>Pagamento via Pix</h2>
        <QrCode size={18} aria-hidden="true" />
      </div>

      <p className={styles.instrucao}>
        Abra o aplicativo do seu banco, escaneie o QR Code abaixo ou use o Pix Copia e Cola para concluir o
        pagamento.
      </p>

      <div className={styles.qrWrapper}>
        <QrCodePix codigo={codigoPix} />
      </div>

      <div className={styles.campo}>
        <label className={styles.label} htmlFor="codigoPix">
          Pix Copia e Cola
        </label>

        <div className={styles.inputCodigo}>
          <input
            id="codigoPix"
            className={styles.input}
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

      <p className={styles.aviso}>
        Após a confirmação do pagamento pelo seu banco, a compra é liberada automaticamente. Não é necessário
        enviar comprovante.
      </p>
    </section>
  );
}

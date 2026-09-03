import { useEffect, useState } from 'react';
import { AlertTriangle, Check, Copy } from 'lucide-react';
import QRCode from 'react-qr-code';
import FormInput from '../../Inputs/FormInput/FormInput';

import styles from './PagamentoPixCard.module.css';

interface PagamentoPixCardProps {
  codigoPix: string;
  copiado: boolean;
  onCopiarCodigo: () => void;
  /** Duração do código Pix em segundos, usada pelo cronômetro interno quando o card não é controlado por `expirado`. Padrão: 15 minutos. */
  duracaoSegundos?: number;
  /**
   * Chamado quando o usuário pede um novo QR Code após a expiração.
   * Se omitido, o card apenas reinicia seu próprio cronômetro internamente.
   */
  onGerarNovoQrCode?: () => void;
  /**
   * Controla o estado de expiração a partir de fora (ex.: mesmo cronômetro exibido no Resumo do Pedido).
   * Quando fornecido, o cronômetro interno do card é ignorado e esse valor manda.
   * Se omitido, o card usa seu próprio cronômetro interno (útil para uso isolado).
   */
  expirado?: boolean;
}

const instrucoesPix = [
  "Abra o app do seu banco e escolha pagar com PIX",
  "Escaneie o QR Code ou cole o código copiado",
  "Confirme o pagamento no app do seu banco"
];

const DURACAO_PADRAO_SEGUNDOS = 15 * 60;

export function PagamentoPixCard({
  codigoPix,
  copiado,
  onCopiarCodigo,
  duracaoSegundos = DURACAO_PADRAO_SEGUNDOS,
  onGerarNovoQrCode,
  expirado: expiradoControlado,
}: PagamentoPixCardProps) {
  const [mostrarCodigoCompleto, setMostrarCodigoCompleto] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(duracaoSegundos);

  // Reinicia o cronômetro interno sempre que um novo código Pix for exibido
  // (só é relevante quando o card não está sendo controlado externamente por `expirado`).
  // Ajuste de estado feito durante a renderização (em vez de em um efeito) para evitar o disparo de uma renderização em cascata
  const [codigoPixAnterior, setCodigoPixAnterior] = useState(codigoPix);
  if (codigoPix !== codigoPixAnterior) {
    setCodigoPixAnterior(codigoPix);
    setTempoRestante(duracaoSegundos);
  }

  // Cronômetro regressivo interno: só roda quando o card não é controlado por `expirado`.
  useEffect(() => {
    if (expiradoControlado !== undefined) return;
    if (tempoRestante <= 0) return;

    const interval = setInterval(() => {
      setTempoRestante((tempoAtual) => Math.max(tempoAtual - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [tempoRestante, expiradoControlado]);

  const expirado = expiradoControlado ?? tempoRestante <= 0;

  function handleGerarNovoQrCode() {
    if (onGerarNovoQrCode) {
      onGerarNovoQrCode();
    } else {
      // Sem callback do pai: o próprio card reinicia o cronômetro para permitir novo pagamento.
      setTempoRestante(duracaoSegundos);
    }
  }

  if (expirado) {
    return (
      <section className={styles.card}>
        <div className={styles.expiradoContainer}>
          <div className={styles.expiradoIconWrapper}>
            <AlertTriangle size={32} aria-hidden="true" />
          </div>

          <h3 className={styles.expiradoTitulo}>Tempo Expirado</h3>

          <p className={styles.expiradoTexto}>
            O código PIX expirou. Gere um novo código para continuar.
          </p>

          <button
            type="button"
            className={styles.btnGerarNovoQrCode}
            onClick={handleGerarNovoQrCode}
          >
            Gerar Novo QR Code
          </button>
        </div>
      </section>
    );
  }

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
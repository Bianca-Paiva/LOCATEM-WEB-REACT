import { useState } from 'react';
import styles from './ResumoPedido.module.css';
import { Tag, Lock } from 'lucide-react';
import type {
  PrazoPagamento,
  ResumoPedidoVariant,
} from '../../../../types/checkout';

interface ResumoPedidoProps {
  variant: ResumoPedidoVariant;
  subtotal?: number;
  total?: number;
  onCalcularFrete?: (cep: string) => void;
  freteValor?: number | null;
  onAplicarCupom?: (codigo: string) => void;
  cupomAplicado?: string | null;
  ctaLabel?: string;
  onCtaClick?: () => void;
  ctaDisabled?: boolean;
  prazoPagamento?: PrazoPagamento;
  mostrarSeguro?: boolean;
}

const formatarPreco = (valor: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);

export function ResumoPedido({
  variant,
  subtotal = 0,
  total = 0,
  onCalcularFrete,
  freteValor,
  onAplicarCupom,
  cupomAplicado,
  ctaLabel,
  onCtaClick,
  ctaDisabled,
  prazoPagamento,
  mostrarSeguro = variant === 'pagamento',
}: ResumoPedidoProps) {
  const [cepInput, setCepInput] = useState('');
  const [cupomInput, setCupomInput] = useState('');

  return (
    <section
      className={styles.card}
      aria-labelledby="resumo-pedido-titulo"
    >
      <h2
        className={styles.titulo}
        id="resumo-pedido-titulo"
      >
        Resumo do Pedido
      </h2>

      {variant === 'vazio' && (
        <p className={styles.textoVazio}>
          Aqui encontrará os valores da sua compra assim que adicionar produtos.
        </p>
      )}

      {variant === 'carrinho' && (
        <div className={styles.corpo}>
          <div className={styles.linha}>
            <span className={styles.linhaLabel}>
              Subtotal
            </span>

            <strong className={styles.linhaValor}>
              {formatarPreco(subtotal)}
            </strong>
          </div>

          <div className={styles.freteBloco}>
            <div className={styles.linha}>
              <span className={styles.linhaLabel}>
                Frete{' '}
                <span className={styles.required}>
                  *
                </span>
              </span>

              {freteValor != null && (
                <strong
                  className={
                    freteValor === 0
                      ? styles.freteGratis
                      : styles.linhaValor
                  }
                >
                  {freteValor === 0
                    ? 'Grátis'
                    : formatarPreco(freteValor)}
                </strong>
              )}
            </div>

            <div className={styles.freteInputRow}>
              <div className={styles.inputContainer}>
                <input
                  className={styles.inputSemBorda}
                  value={cepInput}
                  placeholder="Informe um CEP"
                  inputMode="numeric"
                  onChange={(e) =>
                    setCepInput(e.target.value)
                  }
                  aria-label="CEP"
                />

                <button
                  className={styles.btnInterno}
                  onClick={() =>
                    onCalcularFrete?.(cepInput)
                  }
                  type="button"
                >
                  Usar
                </button>
              </div>

              <button
                className={styles.linkTexto}
                type="button"
              >
                Não sei o meu CEP
              </button>
            </div>
          </div>

          <div className={styles.cupomBloco}>
            <div className={styles.inputComIcone}>
              <Tag
                size={18}
                aria-hidden="true"
              />

              <input
                className={styles.inputSemBorda}
                value={cupomInput}
                placeholder="Inserir código de cupom"
                onChange={(e) =>
                  setCupomInput(e.target.value)
                }
                aria-label="Código do cupom"
              />

              <button
                className={styles.btnInterno}
                onClick={() =>
                  onAplicarCupom?.(cupomInput)
                }
                type="button"
              >
                Aplicar
              </button>
            </div>

            {cupomAplicado && (
              <p className={styles.cupomAplicadoTexto}>
                Cupom “{cupomAplicado}” aplicado
              </p>
            )}
          </div>

          <div className={styles.linhaTotal}>
            <span>Total</span>

            <span>
              {formatarPreco(total)}
            </span>
          </div>

          <button
            className={styles.btnPrimario}
            type="button"
            onClick={onCtaClick}
            disabled={ctaDisabled}
          >
            {ctaLabel ?? 'Continuar para Pagamento'}
          </button>
        </div>
      )}

      {variant === 'pagamento' && (
        <div className={styles.corpo}>
          <div className={styles.linhaTotal}>
            <span>Total</span>

            <span>
              {formatarPreco(total)}
            </span>
          </div>

          {prazoPagamento && (
            <div className={styles.prazoBloco}>
              <span className={styles.prazoLabel}>
                {prazoPagamento.expirado
                  ? 'Expirado'
                  : 'Pague em até'}
              </span>

              {!prazoPagamento.expirado && (
                <strong className={styles.prazoValor}>
                  {prazoPagamento.texto}
                </strong>
              )}
            </div>
          )}

          {ctaLabel && (
            <button
              className={styles.btnPrimario}
              type="button"
              onClick={onCtaClick}
              disabled={ctaDisabled}
            >
              {ctaLabel}
            </button>
          )}
        </div>
      )}

      {mostrarSeguro && (
        <div className={styles.seguroRodape}>
          <Lock
            size={14}
            aria-hidden="true"
          />
          Pagamento 100% seguro
        </div>
      )}
    </section>
  );
}
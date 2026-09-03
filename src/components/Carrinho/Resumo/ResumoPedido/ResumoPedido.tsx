import { useEffect, useState } from 'react';
import styles from './ResumoPedido.module.css';
import { Tag } from 'lucide-react';
import { Icon } from '@iconify/react';
import { maskCEP, validateCEP } from '../../../../hooks/masks';
import type {
  PrazoPagamento,
  ResumoPedidoVariant,
} from '../../../../types/checkout';

interface ResumoPedidoProps {
  variant: ResumoPedidoVariant;
  subtotal?: number;
  desconto?: number;
  total?: number;
  onCalcularFrete?: (cep: string) => void;
  freteValor?: number | null;
  onAplicarCupom?: (codigo: string) => void;
  cupomAviso?: string | null;
  onOcultarCupomAviso?: () => void;
  ctaLabel?: string;
  onCtaClick?: () => void;
  ctaDisabled?: boolean;
  prazoPagamento?: PrazoPagamento;
  /** Segundos restantes até a expiração — fonte única de verdade, calculada pelo hook de pagamento. */
  tempoRestanteSegundos?: number;
  mostrarSeguro?: boolean;
}

const formatarPreco = (valor: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);

function formatarTempo(segundos: number): string {
  const minutos = Math.floor(segundos / 60).toString().padStart(2, '0');
  const segundosRestantes = (segundos % 60).toString().padStart(2, '0');
  return `${minutos}:${segundosRestantes}`;
}

export function ResumoPedido({
  variant,
  subtotal = 0,
  desconto = 0,
  total = 0,
  onCalcularFrete,
  freteValor,
  onAplicarCupom,
  cupomAviso,
  onOcultarCupomAviso,
  ctaLabel,
  onCtaClick,
  ctaDisabled,
  prazoPagamento,
  tempoRestanteSegundos = 0,
  mostrarSeguro = variant === 'pagamento' || variant === 'metodoPagamento',
}: ResumoPedidoProps) {
  const [cepInput, setCepInput] = useState('');
  const [cupomInput, setCupomInput] = useState('');
  const cepValido = validateCEP(cepInput);

  useEffect(() => {
    if (!cupomAviso || !onOcultarCupomAviso) {
      return;
    }

    const timeout = window.setTimeout(onOcultarCupomAviso, 6_000);

    return () => window.clearTimeout(timeout);
  }, [cupomAviso, onOcultarCupomAviso]);

  return (
    <section className={styles.card} aria-labelledby="resumo-pedido-titulo">
      <h2 className={styles.titulo} id="resumo-pedido-titulo">
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
                      : styles.freteValor
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
                  onChange={(e) => setCepInput(maskCEP(e.target.value))}
                  aria-label="CEP"
                />

                <button
                  className={styles.btnInterno}
                  onClick={() =>
                    onCalcularFrete?.(cepInput)
                  }
                  type="button"
                  disabled={!cepValido}
                >
                  Usar
                </button>
              </div>

              <button
                className={styles.linkTexto}
                type="button"
                onClick={() => window.open('https://buscacepinter.correios.com.br/app/endereco/index.php', '_blank')}
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
                  setCupomInput(e.target.value.toUpperCase())
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

            {cupomAviso && (
              <p className={styles.cupomAplicadoTexto}>
                Cupom {cupomAviso} aplicado
              </p>
            )}

            {desconto > 0 && (
              <div className={styles.linha}>
                <span className={styles.linhaLabel}>Desconto</span>
                <strong className={styles.desconto}>-{formatarPreco(desconto)}</strong>
              </div>
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

      {(variant === 'metodoPagamento' || variant === 'pagamento') && (
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
                <div className={styles.prazoValores}>
                  <strong className={styles.prazoContador}>
                    {formatarTempo(tempoRestanteSegundos)}
                  </strong>
                  <span className={styles.prazoData}>
                    {prazoPagamento.texto}
                  </span>
                </div>
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
          <Icon
            icon="boxicons:lock-filled"
            width="14"
            height="14"
            aria-hidden="true"
          />
          Pagamento 100% seguro
        </div>
      )}
    </section>
  );
}
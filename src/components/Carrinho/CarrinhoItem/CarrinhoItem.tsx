import styles from './CarrinhoItem.module.css';
import { Clock, Trash2, Zap } from 'lucide-react';
import type { CarrinhoItemData } from '../../../types/checkout';

interface CarrinhoItemProps {
  item: CarrinhoItemData;
  onQuantidadeChange?: (id: string, quantidade: number) => void;
  onDiasChange?: (id: string, dias: number) => void;
  onRemove?: (id: string) => void;
}

const QUANTIDADE_OPTIONS = [1, 2, 3, 4, 5];

const DIAS_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 14, 21, 30];

function formatarPreco(valor: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

export function CarrinhoItem({
  item,
  onQuantidadeChange,
  onDiasChange,
  onRemove,
}: CarrinhoItemProps) {
  /*
   * Considerei precoUnitario como o valor de uma unidade por dia.
   *
   * Exemplo:
   * R$ 99,98 × 2 unidades × 3 dias.
   */
  const total =
    item.precoUnitario *
    item.quantidade *
    item.dias;

  return (
    <article className={styles.linha}>
      <img
        className={styles.thumb}
        src={item.image}
        alt={item.title}
      />
      <div className={styles.info}>
        <h3 className={styles.titulo}>
          {item.title}
        </h3>

        <div className={styles.metaRow}>
          <span className={styles.metaTag}>
            <Clock size={14} aria-hidden="true" />

            <select
              className={styles.selectMeta}
              value={item.dias}
              onChange={(event) =>
                onDiasChange?.(
                  item.id,
                  Number(event.target.value),
                )
              }
              aria-label={`Período de locação de ${item.title}`}
            >
              {DIAS_OPTIONS.map((dias) => (
                <option key={dias} value={dias}>
                  {dias} {dias === 1 ? 'dia' : 'dias'}
                </option>
              ))}
            </select>
          </span>

          <span className={styles.metaTag}>
            <Zap size={14} aria-hidden="true" />
            {item.voltagem}
          </span>
        </div>
      </div>

      <div className={styles.quantidadeBox}>
        <span className={styles.campoLabel}>
          Quantidade
        </span>

        <select
          className={styles.selectQtd}
          value={item.quantidade}
          onChange={(event) =>
            onQuantidadeChange?.(
              item.id,
              Number(event.target.value),
            )
          }
          aria-label={`Quantidade de ${item.title}`}
        >
          {QUANTIDADE_OPTIONS.map((quantidade) => (
            <option
              key={quantidade}
              value={quantidade}
            >
              {quantidade}{' '}
              {quantidade === 1
                ? 'unidade'
                : 'unidades'}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.totalBox}>
        <span className={styles.totalLabel}>
          Total:
        </span>

        <strong className={styles.totalValor}>
          {formatarPreco(total)}
        </strong>
      </div>

      <button
        className={styles.btnRemover}
        type="button"
        onClick={() => onRemove?.(item.id)}
        aria-label={`Remover ${item.title}`}
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>
    </article>
  );
}
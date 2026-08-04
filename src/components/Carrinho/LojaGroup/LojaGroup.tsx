import styles from './LojaGroup.module.css';
import { CarrinhoItem } from '../CarrinhoItem/CarrinhoItem';
import { BadgeCheck } from 'lucide-react';
import type { LojaGroupData } from '../../../types/checkout';

interface LojaGroupProps {
  loja: LojaGroupData;

  onQuantidadeChange?: (
    id: string,
    quantidade: number,
  ) => void;

  onDiasChange?: (
    id: string,
    dias: number,
  ) => void;

  onRemoveItem?: (id: string) => void;
}

export function LojaGroup({
  loja,
  onQuantidadeChange,
  onDiasChange,
  onRemoveItem,
}: LojaGroupProps) {
  return (
    <section
      className={styles.wrapper}
      aria-labelledby={`loja-${loja.nomeLoja}`}
    >
      <header className={styles.header}>
        <div>
          <h2
            className={styles.nomeLoja}
            id={`loja-${loja.nomeLoja}`}
          >
            Produto de {loja.nomeLoja}
          </h2>

          <span className={styles.lojaOficial}>
            Loja oficial {loja.lojaOficialDe}

            {loja.verificado && (
              <BadgeCheck
                size={15}
                color="#1677ff"
                aria-label="Loja verificada"
              />
            )}
          </span>
        </div>
      </header>

      <div className={styles.itens}>
        {loja.itens.map((item) => (
          <CarrinhoItem
            key={item.id}
            item={item}
            onQuantidadeChange={onQuantidadeChange}
            onDiasChange={onDiasChange}
            onRemove={onRemoveItem}
          />
        ))}
      </div>
    </section>
  );
}

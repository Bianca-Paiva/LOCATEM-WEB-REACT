import { ItemCarrinho } from '../ItemCarrinho/ItemCarrinho';
import styles from './LojaGroup.module.css';
import type { LojaGroupData } from '../../../types/checkout';

interface LojaGroupProps {
  loja: LojaGroupData;
  onQuantidadeChange: (id: string, quantidade: number) => void;
  onDiasChange: (id: string, dias: number) => void;
  onRemoveItem: (id: string) => void;
  onSelecionarItem: (id: string) => void;
}

export function LojaGroup({ loja, onQuantidadeChange, onDiasChange, onRemoveItem, onSelecionarItem }: LojaGroupProps) {
  return (
    <section className={styles.card}>
      <header className={styles.cabecalho}>
        <h2 className={styles.nomeLoja}>{loja.nomeLoja}</h2>
      </header>

      <div className={styles.itens}>
        {loja.itens.map((item) => (
          <ItemCarrinho
            key={item.id}
            item={item}
            onQuantidadeChange={onQuantidadeChange}
            onDiasChange={onDiasChange}
            onRemove={onRemoveItem}
            onSelecionar={onSelecionarItem}
          />
        ))}
      </div>
    </section>
  );
}

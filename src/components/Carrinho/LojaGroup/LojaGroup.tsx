import { ItemCarrinho } from '../ItemCarrinho/ItemCarrinho';
import styles from './LojaGroup.module.css';
import type { LojaGroupData } from '../../../types/checkout';

interface LojaGroupProps {
  loja: LojaGroupData;
  onQuantidadeChange: (id: string, quantidade: number) => void;
  onDiasChange: (id: string, dias: number) => void;
  onRemoveItem: (id: string) => void;
  onSelecionarItem: (id: string) => void;
  onSelecionarLoja: (ids: string[], selecionado: boolean) => void;
}

export function LojaGroup({ loja, onQuantidadeChange, onDiasChange, onRemoveItem, onSelecionarItem, onSelecionarLoja }: LojaGroupProps) {
  const todosSelecionados = loja.itens.length > 0 && loja.itens.every((item) => item.selecionado);

  return (
    <section className={styles.card}>
      <header className={styles.cabecalho}>
        <label className={styles.selecionarLoja}>
          <input
            type="checkbox"
            checked={todosSelecionados}
            onChange={(event) => onSelecionarLoja(loja.itens.map((item) => item.id), event.target.checked)}
            aria-label={`Selecionar todos os produtos de ${loja.nomeLoja}`}
          />
          <h2 className={styles.nomeLoja}>{loja.nomeLoja}</h2>
        </label>
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

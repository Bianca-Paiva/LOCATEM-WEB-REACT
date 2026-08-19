import { Trash2 } from 'lucide-react';
import SeletorQuantidade from '../../Inputs/SeletorQuantidade/SeletorQuantidade';
import FormSelect, { type FormSelectOption } from '../../Inputs/FormSelect/FormSelect';
import styles from './ItemCarrinho.module.css';

interface ItemCarrinhoDataShape {
  id: string;
  image: string;
  title: string;
  dias: number;
  quantidade: number;
  precoUnitario: number;
  estoqueDisponivel?: number;
}

interface ItemCarrinhoProps {
  item: ItemCarrinhoDataShape;
  onQuantidadeChange: (id: string, quantidade: number) => void;
  onDiasChange: (id: string, dias: number) => void;
  onRemove: (id: string) => void;
  diasMaximo?: number;
}

const formatarPreco = (valor: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

export function ItemCarrinho({
  item,
  onQuantidadeChange,
  onDiasChange,
  onRemove,
  diasMaximo = 30,
}: ItemCarrinhoProps) {
  const total = item.precoUnitario * item.quantidade * item.dias;

  const opcoesDias: FormSelectOption[] = Array.from({ length: diasMaximo }, (_, index) => {
    const dia = index + 1;
    return { value: String(dia), label: `${dia} ${dia === 1 ? 'dia' : 'dias'}` };
  });

  return (
    <div className={styles.item}>
      <div className={styles.linhaPrincipal}>
        <img className={styles.imagem} src={item.image} alt={item.title} />

        <div className={styles.info}>
          <h3 className={styles.titulo}>{item.title}</h3>
          <p className={styles.subinfo}>
            {item.dias} {item.dias === 1 ? 'dia' : 'dias'} de aluguel
          </p>
          <p className={styles.preco}>
            {formatarPreco(item.precoUnitario)}/dia × {item.dias} {item.dias === 1 ? 'dia' : 'dias'}
          </p>
        </div>

        <div className={styles.acoes}>
          <button className={styles.remover} type="button" onClick={() => onRemove(item.id)} aria-label="Remover item">
            <Trash2 size={18} />
          </button>
          <span className={styles.total}>Total: {formatarPreco(total)}</span>
        </div>
      </div>

      <div className={styles.controles}>
        <div className={styles.controleDias}>
          <FormSelect
            id={`dias-${item.id}`}
            label="Dias de aluguel"
            required
            options={opcoesDias}
            value={String(item.dias)}
            onChange={(value) => onDiasChange(item.id, Number(value))}
          />
        </div>

        <div className={styles.controleQuantidade}>
          <SeletorQuantidade
            quantidade={item.quantidade}
            estoqueDisponivel={item.estoqueDisponivel}
            exibirEstoqueDisponivel={item.estoqueDisponivel != null}
            onDecrementar={() => onQuantidadeChange(item.id, item.quantidade - 1)}
            onIncrementar={() => onQuantidadeChange(item.id, item.quantidade + 1)}
          />
        </div>
      </div>
    </div>
  );
}

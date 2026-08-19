import { ShoppingCart } from 'lucide-react';
import styles from './CarrinhoVazio.module.css';

interface CarrinhoVazioProps {
  onConferirProdutos?: () => void;
}

export function CarrinhoVazio({ onConferirProdutos }: CarrinhoVazioProps) {
  return (
    <div className={styles.wrapper}>
      <ShoppingCart size={48} className={styles.icone} aria-hidden="true" />
      <h2 className={styles.titulo}>Seu carrinho está vazio</h2>
      <p className={styles.texto}>Explore nosso catálogo e encontre a ferramenta ideal para o seu projeto.</p>
      <button className={styles.botao} type="button" onClick={onConferirProdutos}>
        Conferir produtos
      </button>
    </div>
  );
}

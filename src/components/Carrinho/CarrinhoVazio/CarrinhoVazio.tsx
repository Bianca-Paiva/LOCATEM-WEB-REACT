import styles from './CarrinhoVazio.module.css';
import { ShoppingCart, ArrowRight } from 'lucide-react';
interface CarrinhoVazioProps { onConferirProdutos?: () => void; }
export function CarrinhoVazio({ onConferirProdutos }: CarrinhoVazioProps) {
  return <div className={styles.wrapper}><ShoppingCart size={27} aria-hidden="true" /><div className={styles.textos}><h2 className={styles.titulo}>Seu carrinho está vazio</h2><p className={styles.subtitulo}>Adicione produtos.</p></div><button className={styles.link} type="button" onClick={onConferirProdutos}>Conferir produtos <ArrowRight size={15} aria-hidden="true" /></button></div>;
}

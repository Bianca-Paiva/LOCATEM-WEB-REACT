import { useState } from 'react';
import styles from './ProdutoInfo.module.css';

interface ProdutoInfoProps {
  title: string;
  price: string;
  rating: number;
  reviewCount: number;
  imageVerificado: string;
  imageNota: string;
  brand: string;
  onAlugar?: () => void;
  onAddCarrinho?: () => void;
}

const TENSAO_OPTIONS = ['127V', '220V', 'Bivolt'];
const TAMANHO_OPTIONS = ['Selecione'];

export function ProdutoInfo({
  title,
  price,
  rating,
  reviewCount,
  imageNota,
  brand,
  onAlugar,
  onAddCarrinho,
}: ProdutoInfoProps) {
  const [tensaoSelecionada, setTensaoSelecionada] = useState<string | null>(null);
  const [tamanho, setTamanho] = useState('Selecione');
  const [quantidade, setQuantidade] = useState(1);

  const decrement = () => setQuantidade(prev => Math.max(1, prev - 1));
  const increment = () => setQuantidade(prev => prev + 1);

  return (
    <div className={styles.produtoInfoWrapper}>
      <h1 className={styles.titulo}>{title}</h1>

      <div className={styles.ratingRow}>
        <img src={imageNota} alt="Estrela" className={styles.starIcon} />
        <span className={styles.ratingValor}>{rating.toFixed(1)}</span>
        <span className={styles.ratingCount}>({reviewCount} avaliações)</span>
        <span className={styles.brandTag}>{brand}</span>
      </div>

      <div className={styles.precoBox}>
        <span className={styles.precoPrefix}>R$</span>
        <span className={styles.precoValor}>{price}</span>
        <span className={styles.precoDia}>/dia</span>
      </div>

      {/* Tensão */}
      <div className={styles.opcaoGrupo}>
        <p className={styles.opcaoLabel}>Tensão</p>
        <div className={styles.botoesOpcao}>
          {TENSAO_OPTIONS.map(t => (
            <button
              key={t}
              className={`${styles.btnOpcao} ${tensaoSelecionada === t ? styles.btnOpcaoAtivo : ''}`}
              onClick={() => setTensaoSelecionada(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tamanho */}
      <div className={styles.opcaoGrupo}>
        <p className={styles.opcaoLabel}>Tempo</p>
        <select
          className={styles.selectTamanho}
          value={tamanho}
          onChange={e => setTamanho(e.target.value)}
        >
          {TAMANHO_OPTIONS.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
          <option value="1 dia">1 dia</option>
          <option value="3 dias">3 dias</option>
          <option value="7 dias">7 dias</option>
          <option value="15 dias">15 dias</option>
          <option value="30 dias">30 dias</option>
        </select>
      </div>

      {/* Quantidade */}
      <div className={styles.opcaoGrupo}>
        <p className={styles.opcaoLabel}>Quantidade</p>
        <div className={styles.quantidadeControle}>
          <button className={styles.btnQuantidade} onClick={decrement} aria-label="Diminuir">−</button>
          <span className={styles.quantidadeValor}>{quantidade}</span>
          <button className={styles.btnQuantidade} onClick={increment} aria-label="Aumentar">+</button>
        </div>
      </div>

      {/* CTAs */}
      <div className={styles.ctasContainer}>
        <button className={styles.btnLocar} onClick={onAlugar}>
          Locar
        </button>
        <button className={styles.btnCarrinho} onClick={onAddCarrinho}>
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}
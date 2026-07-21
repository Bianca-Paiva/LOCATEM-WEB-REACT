import { useState } from 'react';
import TempoDropdown from '../TempoDropdown/TempoDropdown';
import SeletorQuantidade from '../../SolicitarReserva/SeletorQuantidade/SeletorQuantidade';
import styles from './ProdutoInfo.module.css';

interface ProdutoInfoProps {
  title: string;
  price: string;
  rating: number;
  reviewCount: number;
  imageVerificado: string;
  imageNota: string;
  brand: string;
  estoqueDisponivel: number;
  onAlugar?: () => void;
  onReservar?: () => void;
  onAddCarrinho?: () => void;
}

const TENSAO_OPTIONS = ['127V', '220V', 'Bivolt'];

export function ProdutoInfo({
  title,
  price,
  rating,
  reviewCount,
  imageNota,
  brand,
  estoqueDisponivel,
  onAlugar,
  onReservar,
  onAddCarrinho,
}: ProdutoInfoProps) {

  const [tensaoSelecionada, setTensaoSelecionada] = useState<string | null>(null);
  const [tempo, setTempo] = useState('Selecione');
  const [quantidade, setQuantidade] = useState(1);

  // limite mínimo é 1 unidades
  const decrement = () => setQuantidade(prev => Math.max(1, prev - 1));

  // O limite máximo de unidades é igual ao estoque disponível
  const increment = () => setQuantidade(prev => Math.min(estoqueDisponivel, prev + 1));

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

      <div className={styles.seletoresRow}>

        {/* Tempo */}
        <div className={styles.opcaoGrupo}>
          <p className={styles.opcaoLabel}>Tempo</p>
          <TempoDropdown value={tempo} onChange={setTempo} /> {/* <-- Novo Dropdown aqui! */}
        </div>

        {/* Quantidade */}
        <div className={styles.opcaoGrupo}>
          <SeletorQuantidade
            quantidade={quantidade}
            estoqueDisponivel={estoqueDisponivel}
            onDecrementar={decrement}
            onIncrementar={increment}
          />
        </div>
        
      </div>

      {/* CTAs */}
      <div className={styles.ctasContainer}>
        <button className={styles.btnLocar} onClick={onAlugar}>
          Locar
        </button>
        <div className={styles.linhaSecundaria}>
          <button className={styles.btnCarrinho} onClick={onAddCarrinho}>
            Adicionar ao carrinho
          </button>
          <button className={styles.btnReservar} onClick={onReservar}>
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
}
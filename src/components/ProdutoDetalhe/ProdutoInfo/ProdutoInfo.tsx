import { useEffect, useState } from 'react';
import PeriodoLocacaoDropdown from '../PeriodoLocacaoDropdown/PeriodoLocacaoDropdown';
import SeletorQuantidade from '../../Inputs/SeletorQuantidade/SeletorQuantidade';
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
  onLocar?: () => void;
  onAddCarrinho?: () => void;

  /**
   * Eleva quantidade, período (em diárias) e tensão selecionados aqui para a página de detalhe, que os repassa como valores iniciais do modal de Solicitação de Locação — assim o usuário não precisa escolher de novo.
  */
  onSelecaoChange?: (selecao: { quantidade: number; diarias: number | null; tensao: string | null }) => void;
}

const TENSAO_OPTIONS = ['127V', '220V', 'Bivolt'];

// Extrai o número de diárias de um valor do PeriodoLocacaoDropdown (ex: "2 dias" -> 2)
function extrairDiarias(periodo: string): number | null {
  const match = periodo.match(/^(\d+)\s*dia/);
  return match ? Number(match[1]) : null;
}

export function ProdutoInfo({
  title,
  price,
  rating,
  reviewCount,
  imageNota,
  brand,
  estoqueDisponivel,
  onAlugar,
  // onLocar,
  onAddCarrinho,
  onSelecaoChange,
}: ProdutoInfoProps) {

  const [tensaoSelecionada, setTensaoSelecionada] = useState<string | null>(null);
  const [periodoLocacao, setPeriodoLocacao] = useState('Selecione');
  const [quantidade, setQuantidade] = useState(1);

  // Repassa a seleção atual (quantidade, diárias, tensão) para a página de detalhe sempre que qualquer uma delas mudar, para pré-preencher o modal.
  useEffect(() => {
    onSelecaoChange?.({
      quantidade,
      diarias: extrairDiarias(periodoLocacao),
      tensao: tensaoSelecionada,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantidade, periodoLocacao, tensaoSelecionada]);

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

        {/* Periodo da Locação */}
        <div className={styles.opcaoGrupo}>
          <p className={styles.opcaoLabel}>Periodo da Locação</p>
          <PeriodoLocacaoDropdown value={periodoLocacao} onChange={setPeriodoLocacao} /> 
        </div>

        {/* Quantidade */}
        <div className={styles.opcaoGrupo}>
          <SeletorQuantidade
            quantidade={quantidade}
            estoqueDisponivel={estoqueDisponivel}
            exibirObrigatorio={false}
            onDecrementar={decrement}
            onIncrementar={increment}
          />
        </div>

      </div>

      {/* CTAs */}
      <div className={styles.ctasContainer}>
        <button className={styles.btnLocar} onClick={onAlugar}>
          Locar Agora
        </button>
        <div className={styles.linhaSecundaria}>
          <button className={styles.btnCarrinho} onClick={onAddCarrinho}>
            Adicionar ao carrinho
          </button>
          {/*<button className={styles.btnLocar} onClick={onLocar}>
            Locar
          </button>*/}
        </div>
      </div>
    </div>
  );
}

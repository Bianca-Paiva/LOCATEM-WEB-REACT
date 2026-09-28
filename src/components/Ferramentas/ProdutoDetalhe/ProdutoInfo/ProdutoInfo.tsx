import { useEffect, useState } from 'react';
import { Heart, Star } from 'lucide-react';
import PeriodoLocacaoDropdown from '../PeriodoLocacaoDropdown/PeriodoLocacaoDropdown';
import SeletorQuantidade from '../../../Shared/Inputs/SeletorQuantidade/SeletorQuantidade';
import BtnPrincipal from '../../../Botoes/BtnPrincipal/BtnPrincipal';
import BtnSecundario from '../../../Botoes/BtnSecundario/BtnSecundario';
import styles from './ProdutoInfo.module.css';

interface ProdutoInfoProps {
  title: string;
  price: string;
  rating: number;
  reviewCount: number;
  imageVerificado?: string;
  imageNota?: string;
  brand: string;
  estoqueDisponivel: number;
  /** Fonte de alimentação da ferramenta atual, vinda do anúncio real. */
  voltagem?: string;
  onAlugar?: () => void;
  onLocar?: () => void;
  onAddCarrinho?: () => void;
  favoritado?: boolean;
  favoritoCarregando?: boolean;
  onToggleFavorito?: () => void;

  /**
   * Eleva quantidade, período (em diárias) e tensão selecionados aqui para a página de detalhe, que os repassa como valores iniciais do modal de Solicitação de Locação — assim o usuário não precisa escolher de novo.
   */
  onSelecaoChange?: (selecao: { quantidade: number; diarias: number | null; tensao: string | null }) => void;
}

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
  brand,
  estoqueDisponivel,
  voltagem,
  onAlugar,
  onAddCarrinho,
  onSelecaoChange,
  favoritado = false,
  favoritoCarregando = false,
  onToggleFavorito,
}: ProdutoInfoProps) {

  // Inicializa com a voltagem real desta ferramenta (mesmo padrão de inicialização já usado para quantidade/periodoLocacao neste componente, sem reset via efeito).
  const [tensaoSelecionada, setTensaoSelecionada] = useState<string | null>(voltagem ?? null);
  const [periodoLocacao, setPeriodoLocacao] = useState('Selecione');
  const [quantidade, setQuantidade] = useState(1);

  // Repassa a seleção atual (quantidade, diárias, tensão) para a página de detalhe sempre que qualquer uma delas mudar, para pré-preencher o modal.
  useEffect(() => {
    onSelecaoChange?.({
      quantidade,
      diarias: extrairDiarias(periodoLocacao),
      tensao: tensaoSelecionada,
    });
  }, [quantidade, periodoLocacao, tensaoSelecionada, onSelecaoChange]);

  // limite mínimo é 1 unidades
  const decrement = () => setQuantidade(prev => Math.max(1, prev - 1));

  // O limite máximo de unidades é igual ao estoque disponível
  const increment = () => setQuantidade(prev => Math.min(estoqueDisponivel, prev + 1));

  return (
    <div className={styles.produtoInfoWrapper}>
      <div className={styles.tituloLinha}>
        <h1 className={styles.titulo}>{title}</h1>

        {onToggleFavorito && (
          <button
            type="button"
            className={`${styles.botaoFavorito} ${favoritado ? styles.botaoFavoritoAtivo : ''}`}
            aria-label={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={favoritado}
            disabled={favoritoCarregando}
            onClick={onToggleFavorito}
          >
            <Heart
              size={23}
              strokeWidth={2}
              color={favoritado ? '#ff4655' : '#1f2937'}
              fill={favoritado ? '#ff4655' : 'none'}
            />
          </button>
        )}
      </div>

      <div className={styles.ratingRow}>
        <Star className={styles.starIcon} size={14} fill="#FFCA00" color="#FFCA00" strokeWidth={0} />
        <span className={styles.ratingValor}>{rating.toFixed(1)}</span>
        <span className={styles.ratingCount}>({reviewCount} avaliações)</span>
        <span className={styles.brandTag}>{brand}</span>
      </div>

      <div className={styles.precoBox}>
        <span className={styles.precoPrefix}>R$</span>
        <span className={styles.precoValor}>{price}</span>
        <span className={styles.precoDia}>/dia</span>
      </div>

      {/* Exibe somente a fonte de alimentação real desta ferramenta. */}
      {voltagem && (
        <div className={styles.opcaoGrupo}>
          <p className={styles.opcaoLabel}>Tensão</p>
          <div className={styles.botoesOpcao}>
            <button
              className={`${styles.btnOpcao} ${tensaoSelecionada === voltagem ? styles.btnOpcaoAtivo : ''}`}
              onClick={() => setTensaoSelecionada(voltagem)}
            >
              {voltagem}
            </button>
          </div>
        </div>
      )}

      <div className={styles.seletoresRow}>

        {/* Período da Locação */}
        <div className={styles.opcaoGrupo}>
          <p className={styles.opcaoLabel}>Período da Locação</p>
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
        <BtnPrincipal
          text="Locar Agora"
          onClick={onAlugar}
          type="button"
        />
        <div className={styles.linhaSecundaria}>
          <BtnSecundario
            text="Adicionar ao carrinho"
            onClick={onAddCarrinho}
            type="button"
          />
        </div>
      </div>
    </div>
  );
}

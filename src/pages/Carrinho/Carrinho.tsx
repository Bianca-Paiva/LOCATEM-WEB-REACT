import Header from '../../components/Header/Header';
import CabecalhoPagina from '../../components/CabecalhoPagina/CabecalhoPagina';
import EstadoVazio from '../../components/MinhasReservas/EstadoVazio/EstadoVazio';
import ProdutoResumoCard from '../../components/ProdutoResumoCard/ProdutoResumoCard';
import BtnPrincipal from '../../components/BtnPrincipal/BtnPrincipal';
import { useCarrinhoStore } from '../../hooks/useCarrinhoStore';
import type { Route } from '../../router/useRouter';
import styles from './Carrinho.module.css';

interface CarrinhoProps {
  navigate: (route: Route) => void;
}

export default function Carrinho({ navigate }: CarrinhoProps) {
  const { itens, removerItem } = useCarrinhoStore();

  const valorTotal = itens.reduce((soma, item) => soma + item.dados.resumo.valor, 0);
  const valorTotalFormatado = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;

  return (
    <>
      <Header navigate={navigate} currentRoute="carrinho" />

      <main className={styles.pagina}>
        <CabecalhoPagina
          titulo="Carrinho"
          subtitulo="Ferramentas adicionadas, aguardando você continuar a locação."
        />

        {itens.length === 0 ? (
          <EstadoVazio
            titulo="Seu carrinho está vazio"
            descricao='Ferramentas adicionadas pelo botão "Adicionar ao carrinho" aparecerão aqui.'
          />
        ) : (
          <>
            <div className={styles.lista}>
              {itens.map((item) => (
                <div key={item.id} className={styles.itemLinha}>
                  <ProdutoResumoCard produto={item.produto} />
                  <div className={styles.detalhesItem}>
                    <span>
                      {item.dados.resumo.dataEntregaFormatada} - {item.dados.resumo.dataDevolucaoFormatada}
                      {' '}({item.dados.resumo.diarias} {item.dados.resumo.diarias === 1 ? 'diária' : 'diárias'})
                    </span>
                    <span>{item.dados.resumo.quantidadeFormatada}</span>
                    <span className={styles.valorItem}>{item.dados.resumo.valorFormatado}</span>
                    <button
                      type="button"
                      className={styles.botaoRemover}
                      onClick={() => removerItem(item.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.rodape}>
              <div className={styles.total}>
                <span>Total estimado</span>
                <strong>{valorTotalFormatado}</strong>
              </div>
              {/* TODO: seguir para a etapa de pagamento/checkout assim que existir no projeto */}
              <BtnPrincipal text="Finalizar locação" />
            </div>
          </>
        )}
      </main>
    </>
  );
}

import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ProdutoSelecionado } from './ProdutoContext';
import type { DadosReservaModal } from '../components/SolicitarReserva/SolicitarReservaModal/SolicitarReservaModal.types';

export interface ItemCarrinho {
  id: string;
  produto: ProdutoSelecionado;
  dados: DadosReservaModal;
  /** Se o item participa da compra (subtotal/total). Ligado por padrão ao ser adicionado. */
  selecionado: boolean;
}

interface CarrinhoContextType {
  itens: ItemCarrinho[];
  adicionarItem: (produto: ProdutoSelecionado, dados: DadosReservaModal) => void;
  removerItem: (id: string) => void;
  atualizarQuantidade: (id: string, quantidade: number) => void;
  atualizarDias: (id: string, dias: number) => void;
  alternarSelecao: (id: string) => void;
  selecionarTodos: (selecionado: boolean) => void;
  selecionarItens: (ids: string[], selecionado: boolean) => void;
}

export const CarrinhoContext = createContext<CarrinhoContextType | null>(null);

// Mesma conversão de preço usada em useSolicitarReservaModal.ts — o preço do
// produto vem como string ("599,98") vinda do cadastro.
function precoDiariaDoProduto(produto: ProdutoSelecionado): number {
  const preco = Number(String(produto.price).replace(',', '.'));
  return Number.isFinite(preco) ? preco : 0;
}

function formatarMoeda(valor: number): string {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// Recalcula o resumo (aluguel/valor) de um item quando a quantidade ou os
// dias de aluguel são alterados diretamente no carrinho — sem mexer nas
// datas/horários já escolhidos no modal de solicitação.
function recalcularDados(
  item: ItemCarrinho,
  alteracoes: { quantidade?: number; diarias?: number },
): DadosReservaModal {
  const precoDiaria = precoDiariaDoProduto(item.produto);
  const quantidade = alteracoes.quantidade ?? item.dados.quantidade;
  const diarias = alteracoes.diarias ?? item.dados.resumo.diarias;
  const { frete } = item.dados.resumo;
  const aluguel = diarias * precoDiaria * quantidade;
  const valor = aluguel + frete;

  return {
    ...item.dados,
    quantidade,
    resumo: {
      ...item.dados.resumo,
      diarias,
      quantidadeFormatada: `${quantidade} ${quantidade === 1 ? 'unidade' : 'unidades'}`,
      aluguel,
      aluguelFormatado: formatarMoeda(aluguel),
      valor,
      valorFormatado: formatarMoeda(valor),
    },
  };
}

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  // Só adiciona a ferramenta ao carrinho (com datas/horários/quantidade já
  // escolhidos no modal) — não cria solicitação, notificação nem dispara
  // fluxo de aprovação/pagamento algum, conforme o fluxo "Adicionar ao carrinho".
  const adicionarItem = (produto: ProdutoSelecionado, dados: DadosReservaModal) => {
    const novoItem: ItemCarrinho = { id: `c-${Date.now()}`, produto, dados, selecionado: true };
    setItens((atuais) => [novoItem, ...atuais]);
  };

  const removerItem = (id: string) => {
    setItens((atuais) => atuais.filter((item) => item.id !== id));
  };

  const atualizarQuantidade = (id: string, quantidade: number) => {
    if (quantidade < 1) return;
    setItens((atuais) =>
      atuais.map((item) =>
        item.id === id ? { ...item, dados: recalcularDados(item, { quantidade }) } : item,
      ),
    );
  };

  const atualizarDias = (id: string, dias: number) => {
    if (dias < 1) return;
    setItens((atuais) =>
      atuais.map((item) =>
        item.id === id ? { ...item, dados: recalcularDados(item, { diarias: dias }) } : item,
      ),
    );
  };

  const alternarSelecao = (id: string) => {
    setItens((atuais) =>
      atuais.map((item) => (item.id === id ? { ...item, selecionado: !item.selecionado } : item)),
    );
  };

  const selecionarTodos = (selecionado: boolean) => {
    setItens((atuais) => atuais.map((item) => ({ ...item, selecionado })));
  };

  const selecionarItens = (ids: string[], selecionado: boolean) => {
    const idsSelecionados = new Set(ids);
    setItens((atuais) =>
      atuais.map((item) =>
        idsSelecionados.has(item.id) ? { ...item, selecionado } : item,
      ),
    );
  };

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        atualizarDias,
        alternarSelecao,
        selecionarTodos,
        selecionarItens,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

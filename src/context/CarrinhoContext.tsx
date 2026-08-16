import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ProdutoSelecionado } from './ProdutoContext';
import type { DadosReservaModal } from '../components/SolicitarReserva/SolicitarReservaModal/SolicitarReservaModal.types';

export interface ItemCarrinho {
  id: string;
  produto: ProdutoSelecionado;
  dados: DadosReservaModal;
}

interface CarrinhoContextType {
  itens: ItemCarrinho[];
  adicionarItem: (produto: ProdutoSelecionado, dados: DadosReservaModal) => void;
  removerItem: (id: string) => void;
}

export const CarrinhoContext = createContext<CarrinhoContextType | null>(null);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  // Só adiciona a ferramenta ao carrinho (com datas/horários/quantidade já
  // escolhidos no modal) — não cria solicitação, notificação nem dispara
  // fluxo de aprovação/pagamento algum, conforme o fluxo "Adicionar ao carrinho".
  const adicionarItem = (produto: ProdutoSelecionado, dados: DadosReservaModal) => {
    const novoItem: ItemCarrinho = { id: `c-${Date.now()}`, produto, dados };
    setItens((atuais) => [novoItem, ...atuais]);
  };

  const removerItem = (id: string) => {
    setItens((atuais) => atuais.filter((item) => item.id !== id));
  };

  return (
    <CarrinhoContext.Provider value={{ itens, adicionarItem, removerItem }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

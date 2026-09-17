import { createContext } from 'react';
import type { ProdutoSelecionado } from '../../Ferramentas/Produto/ProdutoContext';
import type { DadosLocacaoModal } from '../../../components/Locacoes/SolicitarLocacao/SolicitarLocacaoModal/SolicitarLocacaoModal.types';

export interface ItemCarrinho {
    id: string;
    produto: ProdutoSelecionado;
    dados: DadosLocacaoModal;
    /** Se o item participa da compra (subtotal/total). Ligado por padrão ao ser adicionado. */
    selecionado: boolean;
}

export interface CarrinhoContextType {
    itens: ItemCarrinho[];
    adicionarItem: (produto: ProdutoSelecionado, dados: DadosLocacaoModal) => void;
    removerItem: (id: string) => void;
    atualizarQuantidade: (id: string, quantidade: number) => void;
    atualizarDias: (id: string, dias: number) => void;
    alternarSelecao: (id: string) => void;
    selecionarTodos: (selecionado: boolean) => void;
    selecionarItens: (ids: string[], selecionado: boolean) => void;
}

export const CarrinhoContext = createContext<CarrinhoContextType | null>(null);

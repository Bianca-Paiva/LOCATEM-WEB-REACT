import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AvaliacaoProduto } from '../pages/ProdutoDetalhe/ProdutoDetalhe.types';

export interface ProdutoSelecionado {
  id?: number;
  title: string;
  marca: string;
  price: string;
  images: string[];
  imageVerificado: string;
  imageNota: string;
  rating: number;
  reviewCount: number;
  locador: string; /** Nome do locador/anunciante do produto */
  localizacao: string; /** Localização do locador, ex: "São Paulo - SP" */
  categoria: string; /** Categoria da ferramenta, ex: "Elétrica • Parafusadeira/Furadeira" */
  estoqueDisponivel: number; /** Quantidade máxima disponível para reserva */
  diasIndisponiveis?: string[]; /** Datas ("yyyy-mm-dd") em que a ferramenta não está disponível */
  tipoAprovacao?: 'manual' | 'automatica'; /** Forma como as solicitações de locação são aprovadas por este locador */
  voltagem?: string; /** Voltagem/fonte de alimentação, ex: "220V", "127V", "Bivolt", "À bateria", "Manual" */
  descricao?: string; /** Descrição livre da ferramenta, escrita pelo locador no cadastro */
  especificacoes?: { label: string; valor: string }[]; /** Especificações técnicas em pares chave/valor */
  acessorios?: string[]; /** Itens inclusos que acompanham a ferramenta */
  avaliacoes?: AvaliacaoProduto[]; /** Avaliações específicas desta ferramenta */
  distribuicaoAvaliacoes?: number[]; /** Distribuição percentual das notas [5,4,3,2,1] estrelas */
}

interface ProdutoContextType {
  produtoSelecionado: ProdutoSelecionado | null;
  setProdutoSelecionado: (p: ProdutoSelecionado) => void;
}

export const ProdutoContext = createContext<ProdutoContextType | null>(null);

export function ProdutoProvider({ children }: { children: ReactNode }) {
  const [produtoSelecionado, setProdutoSelecionado] =
    useState<ProdutoSelecionado | null>(null);

  return (
    <ProdutoContext.Provider
      value={{ produtoSelecionado, setProdutoSelecionado }}
    >
      {children}
    </ProdutoContext.Provider>
  );
}
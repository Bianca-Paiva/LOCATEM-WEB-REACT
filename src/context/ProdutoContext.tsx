import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
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
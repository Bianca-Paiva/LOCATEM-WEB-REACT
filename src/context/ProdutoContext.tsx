import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
export interface ProdutoSelecionado {
  id?: number;
  title: string;
  brand: string;
  price: string;
  image: string;
  imageVerificado: string;
  imageNota: string;
  rating: number;
  reviewCount: number;
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
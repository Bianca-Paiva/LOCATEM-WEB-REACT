import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// ── Tipo do produto que trafega entre as telas ────────────────────────────────
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

// ── Contexto ──────────────────────────────────────────────────────────────────
interface ProdutoContextType {
  produtoSelecionado: ProdutoSelecionado | null;
  setProdutoSelecionado: (p: ProdutoSelecionado) => void;
}

const ProdutoContext = createContext<ProdutoContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function ProdutoProvider({ children }: { children: ReactNode }) {
  const [produtoSelecionado, setProdutoSelecionado] =
    useState<ProdutoSelecionado | null>(null);

  return (
    <ProdutoContext.Provider value={{ produtoSelecionado, setProdutoSelecionado }}>
      {children}
    </ProdutoContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useProdutoStore() {
  const ctx = useContext(ProdutoContext);
  if (!ctx) throw new Error('useProdutoStore deve ser usado dentro de ProdutoProvider');
  return ctx;
}
/**
 * Armazena a ferramenta selecionada para navegação entre listagens e tela de detalhe.
 * Evita depender de parâmetros longos na URL para transportar o produto completo.
 */
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ProdutoContext, type ProdutoSelecionado } from './ProdutoContext';

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
